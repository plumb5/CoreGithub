using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendTmarcSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly int AdsId;
        readonly SmsConfiguration SmsConfiguration;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        Account? accountDetails;
        #endregion Declaration

        public  SendTmarcSms(int adsId, SmsConfiguration currentSmsConfiguration,string SqlVendor,string jobTagName = "campaign")
        {
            AdsId = adsId;
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            VendorResponses = new List<MLSmsVendorResponse>();
            ErrorMessage = string.Empty;
            using (var objBL =  DLAccount.GetDLAccount(SqlVendor))
            {
                //accountDetails =  objBL.GetAccountDetails(AdsId);
            }
        }

        public bool SendSingleSms(SmsSent smsSent)
        {
            bool result = false;
            string ResponseKey = "";
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    string messageJson = JsonConvert.SerializeObject(new { msisdn = smsSent.PhoneNumber, MessageText = smsSent.MessageContent });
                    string PromotionId = smsSent.WorkFlowId > 0 ? smsSent.WorkFlowId.ToString() + "_" + smsSent.WorkFlowDataId.ToString() : smsSent.SmsSendingSettingId.ToString();
                    string P5Identifier = Guid.NewGuid().ToString().Replace("-", "");
                    ResponseKey = AdsId + "_" + P5Identifier + "_" + PromotionId;
                    result = SendTmarcSmsBulk(messageJson, PromotionId, ResponseKey);
                }
                else
                {
                    result = false;
                    ErrorMessage = "Message was trying to send before or after the time limit";
                }
            }
            catch (Exception ex)
            {
                result = false;
                ErrorMessage = ex.Message.ToString();
            }


            //Put the response data in VendorResponses
            #region Response Ready

            MLSmsVendorResponse VendorResponse = new MLSmsVendorResponse();
            try
            {
                if (result)
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = ResponseKey + "_" + smsSent.PhoneNumber;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = "";
                    VendorResponse.MessageContent = smsSent.MessageContent;
                    VendorResponse.SendStatus = 1;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfiguration.ProviderName;
                    VendorResponse.SmsTemplateId = smsSent.SmsTemplateId;
                    VendorResponse.GroupId = 0;
                    VendorResponse.WorkFlowId = smsSent.WorkFlowId;
                    VendorResponse.WorkFlowDataId = smsSent.WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSent.MessageContent);
                    VendorResponse.P5SMSUniqueID = smsSent.P5SMSUniqueID;
                }
                else
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = ResponseKey + "_" + smsSent.PhoneNumber;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ErrorMessage;
                    VendorResponse.MessageContent = smsSent.MessageContent;
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfiguration.ProviderName;
                    VendorResponse.SmsTemplateId = smsSent.SmsTemplateId;
                    VendorResponse.GroupId = 0;
                    VendorResponse.WorkFlowId = smsSent.WorkFlowId;
                    VendorResponse.WorkFlowDataId = smsSent.WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSent.MessageContent);
                    VendorResponse.P5SMSUniqueID = smsSent.P5SMSUniqueID;
                }
            }
            catch (Exception ex)
            {
                VendorResponse.Id = smsSent.Id;
                VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                VendorResponse.ContactId = smsSent.ContactId;
                VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                VendorResponse.ResponseId = "";
                VendorResponse.NotDeliverStatus = 0;
                VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
                VendorResponse.MessageContent = smsSent.MessageContent;
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.VendorName = SmsConfiguration.ProviderName;
                VendorResponse.SmsTemplateId = smsSent.SmsTemplateId;
                VendorResponse.GroupId = 0;
                VendorResponse.WorkFlowId = smsSent.WorkFlowId;
                VendorResponse.WorkFlowDataId = smsSent.WorkFlowDataId;
                VendorResponse.CampaignJobName = JobTagName;
                VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSent.MessageContent);
                VendorResponse.P5SMSUniqueID = smsSent.P5SMSUniqueID;
            }
            VendorResponses.Add(VendorResponse);
            #endregion Response ready
            return result;
        }

        public bool SendBulkSms(List<SmsSent> smsSentList)
        {
            bool result = false;
            string ResponseKey = "";
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    string messageJson = JsonConvert.SerializeObject(smsSentList.Select(x => new { msisdn = x.PhoneNumber, MessageText = x.MessageContent }));
                    string PromotionId = smsSentList[0].WorkFlowId > 0 ? smsSentList[0].WorkFlowId.ToString() + "_" + smsSentList[0].WorkFlowDataId.ToString() : smsSentList[0].SmsSendingSettingId.ToString();
                    string P5Identifier = Guid.NewGuid().ToString().Replace("-", "");
                    ResponseKey = AdsId + "_" + P5Identifier + "_" + PromotionId;
                    result = SendTmarcSmsBulk(messageJson, PromotionId, ResponseKey);
                }
                else
                {
                    result = false;
                    ErrorMessage = "Message was trying to send before or after the time limit";
                }
            }
            catch (Exception ex)
            {
                result = false;
                ErrorMessage = ex.Message.ToString();
            }


            //Put the response data in VendorResponses
            #region Response Ready
            for (int i = 0; i < smsSentList.Count; i++)
            {
                MLSmsVendorResponse VendorResponse = new MLSmsVendorResponse();
                try
                {
                    if (result)
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = ResponseKey + "_" + smsSentList[i].PhoneNumber;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = "";
                        VendorResponse.MessageContent = smsSentList[i].MessageContent;
                        VendorResponse.SendStatus = 1;
                        VendorResponse.ProductIds = "";
                        VendorResponse.VendorName = SmsConfiguration.ProviderName;
                        VendorResponse.SmsTemplateId = smsSentList[i].SmsTemplateId;
                        VendorResponse.GroupId = 0;
                        VendorResponse.WorkFlowId = smsSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = smsSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSentList[i].MessageContent);
                        VendorResponse.P5SMSUniqueID = smsSentList[i].P5SMSUniqueID;
                    }
                    else
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = ResponseKey + "_" + smsSentList[i].PhoneNumber;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = ErrorMessage;
                        VendorResponse.MessageContent = smsSentList[i].MessageContent;
                        VendorResponse.SendStatus = 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.VendorName = SmsConfiguration.ProviderName;
                        VendorResponse.SmsTemplateId = smsSentList[i].SmsTemplateId;
                        VendorResponse.GroupId = 0;
                        VendorResponse.WorkFlowId = smsSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = smsSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSentList[i].MessageContent);
                        VendorResponse.P5SMSUniqueID = smsSentList[i].P5SMSUniqueID;
                    }
                }
                catch (Exception ex)
                {
                    VendorResponse.Id = smsSentList[i].Id;
                    VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                    VendorResponse.ContactId = smsSentList[i].ContactId;
                    VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                    VendorResponse.ResponseId = "";
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
                    VendorResponse.MessageContent = smsSentList[i].MessageContent;
                    VendorResponse.SendStatus = 4;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfiguration.ProviderName;
                    VendorResponse.SmsTemplateId = smsSentList[i].SmsTemplateId;
                    VendorResponse.GroupId = 0;
                    VendorResponse.WorkFlowId = smsSentList[i].WorkFlowId;
                    VendorResponse.WorkFlowDataId = smsSentList[i].WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSentList[i].MessageContent);
                    VendorResponse.P5SMSUniqueID = smsSentList[i].P5SMSUniqueID;
                }
                VendorResponses.Add(VendorResponse);
            }
            #endregion Response ready
            return result;
        }

        private bool SendTmarcSmsBulk(string messageJson, string PromotionId, string ResponseKey)
        {
            bool responseStatus;
            try
            {
                string callBackURL = AllConfigURLDetails.KeyValueForConfig["SMS_CLICKURL"] + "SmsDeliver/TMarcDelivery?AccountId=" + AdsId + "&SMSSendingSettingDripId=" + PromotionId + "&JobTagName=" + JobTagName + "&IsBulkSms=YES&ResponseKey=" + ResponseKey;
                string apiUrl = SmsConfiguration.ConfigurationUrl;
                string TestOption = AllConfigURLDetails.KeyValueForConfig["SMSTMARCTESTOPTION"].ToString();
                if (TestOption == null || string.IsNullOrEmpty(TestOption))
                    TestOption = "0";
                Uri webService = new Uri(apiUrl);
                HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, webService);
                requestMessage.Headers.Add("APIKey", SmsConfiguration.ApiKey);
                requestMessage.Headers.Add("AdsId", AdsId.ToString());
                requestMessage.Headers.Add("BillingCode", "1");
                requestMessage.Headers.Add("PromotionId", PromotionId);
                requestMessage.Headers.Add("BrandName", accountDetails.AccountName);
                requestMessage.Headers.Add("ClientName", SmsConfiguration.Sender);
                requestMessage.Headers.Add("TestOption", TestOption);
                requestMessage.Headers.Add("MessageType", "1");
                requestMessage.Headers.Add("CallBackURL", callBackURL);
                requestMessage.Content = new StringContent(messageJson, Encoding.UTF8, "application/json");

                HttpClient httpClient = new HttpClient();

                httpClient.Timeout = TimeSpan.FromMinutes(60);
                Task<HttpResponseMessage> httpRequest = httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseContentRead);
                HttpResponseMessage httpResponse = httpRequest.Result;
                HttpContent responseContent = httpResponse.Content;

                int statusCode = (int)httpResponse.StatusCode;
                Task<string> stringContentsTask = responseContent.ReadAsStringAsync();
                string ResponseDetails = stringContentsTask.Result;

                JObject data = JObject.Parse(ResponseDetails);

                if (statusCode == 200 && data != null)
                {
                    if (Convert.ToBoolean(data["SendBulkSmsResult"]["Status"].ToString()))
                    {
                        string ResponseId = data["SendBulkSmsResult"]["ResponseKey"].ToString();
                        if (!string.IsNullOrEmpty(ResponseId))
                        {
                            responseStatus = true;
                            ErrorMessage = "";
                        }
                        else
                        {
                            responseStatus = false;
                            ErrorMessage = "No Response Found";
                        }
                    }
                    else if ((!Convert.ToBoolean(data["SendBulkSmsResult"]["Status"].ToString())) && !string.IsNullOrEmpty(data["SendBulkSmsResult"]["Reason"].ToString()) && data["SendBulkSmsResult"]["Reason"].ToString().Length > 0)
                    {
                        responseStatus = false;
                        ErrorMessage = data["SendBulkSmsResult"]["Reason"].ToString();
                    }
                    else
                    {
                        responseStatus = false;
                        ErrorMessage = "No Response Found";
                    }
                }
                else
                {
                    responseStatus = false;
                    ErrorMessage = "API Call failed";
                }
            }
            catch (WebException we)
            {
                using (ErrorUpdation objError = new ErrorUpdation("TMarcSMS"))
                {
                    objError.AddError(we.Message.ToString(), "", DateTime.Now.ToString(), "SendTmarcSms->SendTmarcSmsBulk", "WebException");
                }

                responseStatus = false;
                ErrorMessage = we.Message.ToString();
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("TMarcSMS"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendTmarcSms->SendTmarcSmsBulk", "Exception");
                }

                responseStatus = false;
                ErrorMessage = ex.Message.ToString();
            }

            return responseStatus;
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
            //dispose unmanaged resources
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
