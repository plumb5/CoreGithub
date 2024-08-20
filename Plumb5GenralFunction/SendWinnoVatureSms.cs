using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{

    public class SendWinnoVatureSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly SmsConfiguration SmsConfiguration;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        private readonly int AdsId;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        public WinnoVatureResponse winnoVatureResponse1 { get; set; }
        #endregion Declaration

        public SendWinnoVatureSms(int adsId, SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            AdsId = adsId;
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            VendorResponses = new List<MLSmsVendorResponse>();
            ErrorMessage = string.Empty;
        }

        public bool SendSingleSms(SmsSent smsSent)
        {
            bool result = false;
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    JArray JArrayDataList = new JArray();

                    WinnoVatureRequest winnoVatureRequest = new WinnoVatureRequest();
                    winnoVatureRequest.tolist = new string[] { smsSent.PhoneNumber };
                    winnoVatureRequest.from = SmsConfiguration.Sender;
                    winnoVatureRequest.entityid = SmsConfiguration.EntityId;
                    winnoVatureRequest.templateid = smsSent.VendorTemplateId;
                    winnoVatureRequest.content = smsSent.MessageContent;
                    winnoVatureRequest.param1 = Convert.ToString(AdsId);
                    winnoVatureRequest.param2 = Convert.ToString(smsSent.SmsSendingSettingId);
                    winnoVatureRequest.param3 = smsSent.PhoneNumber;
                    winnoVatureRequest.param4 = Convert.ToString(smsSent.WorkFlowId);
                    JArrayDataList.Add(winnoVatureRequest);

                    result = SendWinnoVatureBulkSms(JArrayDataList);
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
                if (result && winnoVatureResponse1 != null && !string.IsNullOrEmpty(winnoVatureResponse1.ackid))
                {
                    if (winnoVatureResponse1.status.ToLower().Equals("platform accepted"))
                    {
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                        VendorResponse.ContactId = smsSent.ContactId;
                        VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                        VendorResponse.ResponseId = Convert.ToString(winnoVatureResponse1.ackid);
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = winnoVatureResponse1.status;
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
                        ErrorMessage = winnoVatureResponse1.code + "-" + winnoVatureResponse1.status;
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                        VendorResponse.ContactId = smsSent.ContactId;
                        VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                        VendorResponse.ResponseId = winnoVatureResponse1.ackid;
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
                else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = "";
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = "Message was trying to send before or after the time limit";
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
                else if (!result)
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = "";
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
                else
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = "";
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ErrorMessage;
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
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    JArray JArrayDataList = new JArray();

                    for (int i = 0; i < smsSentList.Count; i++)
                    {
                        string[] phonenumberarray = new string[] { smsSentList[i].PhoneNumber };
                        JObject winnoVatureRequest = new JObject();
                        winnoVatureRequest["tolist"] = JArray.Parse(JsonConvert.SerializeObject(phonenumberarray));
                        winnoVatureRequest["from"] = SmsConfiguration.Sender;
                        winnoVatureRequest["entityid"] = SmsConfiguration.EntityId;
                        winnoVatureRequest["templateid"] = smsSentList[i].VendorTemplateId;
                        winnoVatureRequest["content"] = smsSentList[i].MessageContent;
                        winnoVatureRequest["param1"] = Convert.ToString(AdsId);
                        winnoVatureRequest["param2"] = Convert.ToString(smsSentList[i].SmsSendingSettingId);
                        winnoVatureRequest["param3"] = smsSentList[i].PhoneNumber;
                        winnoVatureRequest["param4"] = Convert.ToString(smsSentList[i].WorkFlowId);
                        JArrayDataList.Add(winnoVatureRequest);
                    }

                    result = SendWinnoVatureBulkSms(JArrayDataList);
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
                    if (result && winnoVatureResponse1 != null && !string.IsNullOrEmpty(winnoVatureResponse1.ackid))
                    {
                        if (winnoVatureResponse1.status.ToLower().Equals("platform accepted"))
                        {
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(winnoVatureResponse1.ackid);
                            VendorResponse.NotDeliverStatus = 0;
                            VendorResponse.ReasonForNotDelivery = winnoVatureResponse1.status;
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
                            ErrorMessage = winnoVatureResponse1.code + "-" + winnoVatureResponse1.status;
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = winnoVatureResponse1.ackid;
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
                    else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = "";
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = "Message was trying to send before or after the time limit";
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
                    else if (!result)
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = "";
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
                    else
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = "";
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = ErrorMessage;
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

        private bool SendWinnoVatureBulkSms(JArray list)
        {
            bool responseStatus = false;
            try
            {

                JObject SendingJObject = new JObject();
                SendingJObject["smslist"] = list;
                SendingJObject["password"] = SmsConfiguration.Password;
                SendingJObject["username"] = SmsConfiguration.UserName;

                using (var DoveSoftHttpClientRequest = new HttpRequestMessage(new HttpMethod("POST"), SmsConfiguration.ConfigurationUrl))
                {
                    DoveSoftHttpClientRequest.Content = new StringContent(JsonConvert.SerializeObject(SendingJObject));
                    DoveSoftHttpClientRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    using (HttpClient SmsPortalHttpClient = new HttpClient())
                    {
                        HttpResponseMessage winnoVatureResponse = SmsPortalHttpClient.SendAsync(DoveSoftHttpClientRequest).Result;
                        string winnoVatureResponseContent = winnoVatureResponse.Content.ReadAsStringAsync().Result;
                        WinnoVatureResponse winnoVatureResponseObj = JsonConvert.DeserializeObject<WinnoVatureResponse>(winnoVatureResponseContent);

                        if (!String.IsNullOrEmpty(winnoVatureResponseObj.ackid) && !String.IsNullOrEmpty(winnoVatureResponseObj.status) && winnoVatureResponseObj.status.ToLower().Equals("platform accepted"))
                        {
                            responseStatus = true;
                            winnoVatureResponse1 = winnoVatureResponseObj;
                        }
                        else
                        {
                            responseStatus = false;
                            winnoVatureResponse1 = winnoVatureResponseObj;
                            ErrorMessage = "StatusCode=" + winnoVatureResponseObj.status + "ErrorMessage=" + Convert.ToString(winnoVatureResponseObj);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
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

    public class WinnoVatureRequest
    {
        public string[] tolist { get; set; }
        public string from { get; set; }
        public string entityid { get; set; }
        public string templateid { get; set; }
        public string content { get; set; }
        public string param1 { get; set; }
        public string param2 { get; set; }
        public string param3 { get; set; }
        public string param4 { get; set; }

    }

    public class WinnoVatureResponse
    {
        public string ackid { get; set; }
        public string code { get; set; }
        public string rtime { get; set; }
        public string status { get; set; }
    }
}
