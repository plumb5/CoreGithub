using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebPush;

namespace Plumb5GenralFunction
{
    public class SendWebPushVapidApiCall : IDisposable
    {
        private readonly string callbackAssembly = "", callbackClass = "", callbackMethod = "", extraparam = "";
        private readonly bool async = true;
        public string ErrorMessage = string.Empty;
        readonly int AccountId;
        public SendWebPushVapidApiCall(int AdsId, bool getAsync, string getCallbackAssembly, string getCallbackClass, string getCallbackMethod, string getExtraparam)
        {
            async = getAsync;
            callbackAssembly = getCallbackAssembly;
            callbackClass = getCallbackClass;
            callbackMethod = getCallbackMethod;
            extraparam = getExtraparam;
            AccountId = AdsId;
        }
        public async Task<bool> SendNotification(WebPushSettings PushSettings, WebPushTemplate webpushtemplate, WebPushSent senderDetails)
        {
            var subscription = new PushSubscription(senderDetails.VapidEndpointUrl, senderDetails.VapidTokenkey, senderDetails.VapidAuthkey);
            //var subscription = new PushSubscription(senderDetails.VapidEndpointUrl, senderDetails.VapidTokenkey, senderDetails.VapidAuthkey, callbackAssembly, callbackClass, callbackMethod, extraparam);
            var vapidDetails = new VapidDetails(PushSettings.VapidSubject, PushSettings.VapidPublicKey, PushSettings.VapidPrivateKey);

            var webPushClient = new WebPushClient();
            try
            {
                var WorkFlowId = senderDetails.WorkFlowId != null ? senderDetails.WorkFlowId : 0;
                var WorkFlowDataId = senderDetails.WorkFlowDataId != null ? senderDetails.WorkFlowDataId : 0;
                var payload = "{\"AdsId\": " + AccountId + ",\"responseid\":\"" + senderDetails.P5UniqueId + "\",\"title\":\"" + senderDetails.MessageTitle + "\",\"message\":\"" + senderDetails.MessageContent.Replace("\r\n", "").Replace("\n", "") + "\",\"Imageurl\":\"" + webpushtemplate.IconImage + "\",\"MachineId\":\"" + senderDetails.MachineId + "\",\"WorkFlowId\":" + WorkFlowId + ",\"WorkFlowDataId\":" + WorkFlowDataId + ",\"BannerImage\":\"" + senderDetails.BannerImage + "\",\"Browser\":\"" + senderDetails.BrowserName + "\",\"RedirectTo\":\"" + senderDetails.OnClickRedirect + "\",\"Button1_Label\":\"" + webpushtemplate.Button1_Label + "\",\"Button2_Label\":\"" + webpushtemplate.Button2_Label + "\",\"Button1_Redirect\":\"" + senderDetails.Button1_Redirect + "\",\"Button2_Redirect\":\"" + senderDetails.Button2_Redirect + "\",\"IsAutoHide\":" + webpushtemplate.IsAutoHide.ToString().ToLower() + ",\"IsWelcomeMessage\":false}";
                //var payload = "{\"title\":\"" + senderDetails.MessageTitle + "\",\"message\":\"" + senderDetails.MessageContent + "\",\"Imageurl\":\"" + webpushtemplate.IconImage + "\",\"MachineId\":\"" + senderDetails.MachineId + "\",\"WorkFlowId\":\"" + 0 + "\",\"WorkFlowDataId\":\"" + 0 + "\",\"WelcomeMsg\":\"0\",\"ExtraActions\":\"" + senderDetails.ExtraAction + "\",\"Browser\":\"" + senderDetails.VendorName + "\",\"PushId\":\"" + senderDetails.PushId + "\",\"Duration\":\"" + Duration + "\",\"Image\":\"" + senderDetails.Image + "\",\"RedirectTo\":\"" + senderDetails.RedirectTo + "\",\"BrowserPushSendingSettingId\":\"" + senderDetails.BrowserPushSendingSettingId + "\"}";

                if (async == true)
                    await webPushClient.SendNotificationAsync(subscription, payload, vapidDetails);
                else
                    webPushClient.SendNotification(subscription, payload, vapidDetails);

                return true;
            }
            catch (WebPushException ex)
            {
                ErrorMessage = ex.Message.ToString();

                using (ErrorUpdation objError = new ErrorUpdation("SendWebPushVapidApiCall_SendNotification"))
                {
                    objError.AddError(ex.Message.ToString(), "SendingSettingId --> " + senderDetails.WebPushSendingSettingId + ", P5UniqueId --> " + senderDetails.P5UniqueId + "", DateTime.Now.ToString(), "P5WebPushWindowsService->SendWebPushThroughVapid", ex.InnerException.ToString(), true);
                }

                return false;
            }
        }

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
