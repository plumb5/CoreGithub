using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;

namespace Plumb5GenralFunction
{
    public class PromoTexterResponses
    {
        public string requestId { get; set; }
        public string remainingBalance { get; set; }
        public List<SmsBatch> smsBatch { get; set; }
    }

    public class SmsBatch
    {
        public string transactionId { get; set; }
        public string unitCost { get; set; }
        public string transactionCost { get; set; }
        public string operatorCode { get; set; }
        public string messageParts { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string country { get; set; }
        public string operators { get; set; }
        public string code { get; set; }
        public string message { get; set; }
    }


    public class SendPromotexterSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly int AdsId;
        readonly SmsConfiguration SmsConfiguration;
        public PromoTexterResponses promotexterResponses;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        #endregion Declaration
        public SendPromotexterSms(int adsId, SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            AdsId = adsId;
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            VendorResponses = new List<MLSmsVendorResponse>();
            promotexterResponses = new PromoTexterResponses();
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

                    JObject EachJObject = new JObject();
                    EachJObject["text"] = smsSent.MessageContent;
                    EachJObject["to"] = smsSent.PhoneNumber;
                    EachJObject["from"] = SmsConfiguration.Sender;
                    JArrayDataList.Add(EachJObject);

                    result = SendPromotexterSmsBulk(JArrayDataList);
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
                if (result && promotexterResponses != null && promotexterResponses.smsBatch != null && promotexterResponses.smsBatch.Count > 0)
                {
                    if (!String.IsNullOrEmpty(promotexterResponses.smsBatch[0].transactionId))
                    {
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                        VendorResponse.ContactId = smsSent.ContactId;
                        VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                        VendorResponse.ResponseId = promotexterResponses.smsBatch[0].transactionId;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = "Sent";
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
                    else if (promotexterResponses.smsBatch[0].code != null && promotexterResponses.smsBatch[0].code != string.Empty)
                    {
                        ErrorMessage = Convert.ToString(promotexterResponses.smsBatch[0].code) + "$$$" + Convert.ToString(promotexterResponses.smsBatch[0].message);
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
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
                        ErrorMessage = "Transaction id not found";
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
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
                }
                else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
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
                        JObject EachJObject = new JObject();
                        EachJObject["text"] = smsSentList[i].MessageContent;
                        EachJObject["to"] = smsSentList[i].PhoneNumber;
                        EachJObject["from"] = SmsConfiguration.Sender;
                        JArrayDataList.Add(EachJObject);
                    }

                    result = SendPromotexterSmsBulk(JArrayDataList);
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
                    if (result && promotexterResponses != null && promotexterResponses.smsBatch != null && promotexterResponses.smsBatch.Count > 0)
                    {
                        if (!String.IsNullOrEmpty(promotexterResponses.smsBatch[i].transactionId))
                        {
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = promotexterResponses.smsBatch[i].transactionId;
                            VendorResponse.NotDeliverStatus = 0;
                            VendorResponse.ReasonForNotDelivery = "Sent";
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
                        else if (promotexterResponses.smsBatch[i].code != null && promotexterResponses.smsBatch[i].code != string.Empty)
                        {
                            ErrorMessage = Convert.ToString(promotexterResponses.smsBatch[i].code) + "$$$" + Convert.ToString(promotexterResponses.smsBatch[i].message);
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
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
                            ErrorMessage = "Transaction id not found";
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
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
                    }
                    else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
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

        private bool SendPromotexterSmsBulk(JArray JArrayDataList)
        {
            bool responseStatus = false;

            try
            {
                JObject SendingJObject = new JObject();
                SendingJObject["messages"] = JArrayDataList;
                SendingJObject["apiKey"] = SmsConfiguration.UserName;
                SendingJObject["apiSecret"] = SmsConfiguration.Password;
                SendingJObject["dlrReport"] = true;
                SendingJObject["referenceId"] = AdsId;
                SendingJObject["dlrCallback"] = AllConfigURLDetails.KeyValueForConfig["PROMOTEXTER_SMS_DELIVERY"].ToString();

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var client = new RestClient(SmsConfiguration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("content-type", "application/json");
                request.AddParameter("application/json", JsonConvert.SerializeObject(SendingJObject), ParameterType.RequestBody);
                IRestResponse PromotexterResponse = client.Execute(request);

                if (PromotexterResponse.StatusCode == HttpStatusCode.OK)
                {
                    promotexterResponses = JsonConvert.DeserializeObject<PromoTexterResponses>(PromotexterResponse.Content);
                    responseStatus = true;
                }
                else
                {
                    responseStatus = false;
                    ErrorMessage = "StatusCode=" + PromotexterResponse.StatusCode + "ErrorMessage=" + PromotexterResponse.Content;
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
}
