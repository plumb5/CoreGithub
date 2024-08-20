using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendVapidWebPush : IDisposable, IBulkWebPushSending
    {
        readonly WebPushSettings webpushprovidersetting;
        WebPushTemplate webpushtemplateDetails;
        readonly int AccountId;

        private readonly string JobTagName;
        public string ErrorMessage { get; set; }

        public List<MLWebPushUpdateResponsesDetails> webpushErrorResponses { get; set; }

        #region Initialization Call Back Method for Updating Response Status
        string callbackAssembly = String.Empty;
        string callbackClass = String.Empty;
        string callbackMethod = String.Empty;
        #endregion


        public SendVapidWebPush(int accountId, int WebPushTemplateId, WebPushSettings webpushproviderdetails, string jobTagName = "campaign", string? sqlVendor = null)
        {
            AccountId = accountId;
            webpushprovidersetting = webpushproviderdetails;

            if (WebPushTemplateId > 0)
            {
                callbackAssembly = "Plumb5GenralFunction";
                callbackClass = "Plumb5GenralFunction.P5WebPushUpdateResponses";
                callbackMethod = "updateWebPushResponses";

                using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(accountId, sqlVendor))
                    webpushtemplateDetails = objDL.GetDetailsSync(new WebPushTemplate() { Id = WebPushTemplateId });
            }

            webpushErrorResponses = new List<MLWebPushUpdateResponsesDetails>();
            JobTagName = jobTagName;
            ErrorMessage = string.Empty;
        }

        public void SendBulkWebPush(List<WebPushSent> webpushSentList)
        {
            foreach (WebPushSent singleData in webpushSentList)
            {
                Task<bool> result = SendWebPushThroughVapid(singleData.WebPushSendingSettingId, webpushprovidersetting, singleData);
            }
        }

        public bool SendSingleRssWebPush(int WebPushSendingSettingId, WebPushSent webpushSentList, WebPushTemplate webpushtemplate)
        {
            webpushtemplateDetails = webpushtemplate;
            Task<bool> result = SendWebPushThroughVapid(WebPushSendingSettingId, webpushprovidersetting, webpushSentList);
            if (result.Result)
                return true;
            else
                return false;
        }

        private async Task<bool> SendWebPushThroughVapid(int SendingSettingId, WebPushSettings PushSettings, WebPushSent senderDetails)
        {
            try
            {
                if (senderDetails.MessageTitle.ToString().Contains("<!--") || ((senderDetails.MessageTitle.ToString().Contains("[{*")) && (senderDetails.MessageTitle.ToString().Contains("*}]"))))
                {
                    MLWebPushUpdateResponsesDetails errorresponsedetails = new MLWebPushUpdateResponsesDetails();
                    errorresponsedetails.P5UniqueId = senderDetails.P5UniqueId;
                    errorresponsedetails.WebPushSendingSettingId = SendingSettingId;
                    errorresponsedetails.StatusCode = "";
                    errorresponsedetails.StatusMessage = "In Template MessageTitle dynamic content not replaced";
                    errorresponsedetails.MachineId = senderDetails.MachineId;
                    errorresponsedetails.IsUnsubscribed = 0;
                    ErrorMessage = "In Template MessageTitle dynamic content not replaced";
                    if (SendingSettingId > 0)
                    {
                        //using (DLWebPushSent objblsms = new DLWebPushSent(AccountId))
                        //    objblsms.UpdateWebPushCampaignResponsesFromBulkCampaign(errorresponsedetails);
                        webpushErrorResponses.Add(errorresponsedetails);
                    }

                    return false;
                }
                else if (senderDetails.MessageContent.ToString().Contains("<!--") || ((senderDetails.MessageContent.ToString().Contains("[{*")) && (senderDetails.MessageContent.ToString().Contains("*}]"))))
                {
                    MLWebPushUpdateResponsesDetails errorresponsedetails = new MLWebPushUpdateResponsesDetails();
                    errorresponsedetails.P5UniqueId = senderDetails.P5UniqueId;
                    errorresponsedetails.WebPushSendingSettingId = SendingSettingId;
                    errorresponsedetails.StatusCode = "";
                    errorresponsedetails.StatusMessage = "In Template MessageContent dynamic content not replaced";
                    errorresponsedetails.MachineId = senderDetails.MachineId;
                    errorresponsedetails.IsUnsubscribed = 0;
                    ErrorMessage = "In Template MessageContent dynamic content not replaced";
                    if (SendingSettingId > 0)
                    {
                        //using (DLWebPushSent objblsms = new DLWebPushSent(AccountId))
                        //    objblsms.UpdateWebPushCampaignResponsesFromBulkCampaign(errorresponsedetails);
                        webpushErrorResponses.Add(errorresponsedetails);
                    }

                    return false;
                }
                else
                {
                    var extraparam = "{\"AdsId\":" + AccountId + ",\"P5UniqueId\":\"" + senderDetails.P5UniqueId + "\",\"MachineId\":\"" + senderDetails.MachineId + "\",\"WebPushTemplateId\":" + senderDetails.WebPushTemplateId + ",\"WebPushSendingSettingId\":" + SendingSettingId + "}";

                    using (SendWebPushVapidApiCall objVapid = new SendWebPushVapidApiCall(AccountId, true, callbackAssembly, callbackClass, callbackMethod, extraparam))
                    {
                        senderDetails.MachineId = senderDetails.MachineId + "~" + SendingSettingId; //for old service worker
                        objVapid.SendNotification(PushSettings, webpushtemplateDetails, senderDetails);
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();

                using (ErrorUpdation objError = new ErrorUpdation("P5WebPushWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "AccountId --> " + AccountId + " , SendingSettingId --> " + SendingSettingId + ", P5UniqueId --> " + senderDetails.P5UniqueId + "", DateTime.Now.ToString(), "P5WebPushWindowsService->SendWebPushThroughVapid", ex.InnerException.ToString(), true);
                }
                return false;
            }
        }

        #region Dispose Method

        bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged ressources
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
