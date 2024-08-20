using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Plumb5GenralFunction
{
    public class SendNetCoreSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly SmsConfiguration SmsConfiguration;
        public NetCoreResult netCoreResponseResult;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        #endregion Declaration

        public SendNetCoreSms(SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            netCoreResponseResult = new NetCoreResult();
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
                    StringBuilder messageurl = new StringBuilder();

                    string MessageContent = HelperForSMS.ReplaceOnlyXMLEncoding(smsSent.MessageContent);
                    messageurl.Append("<MESSAGE><TEXT>" + MessageContent + "</TEXT><TYPE>0</TYPE><MID>" + 0 + "</MID><SMS FROM = '" + SmsConfiguration.Sender + "' TO = '" + smsSent.PhoneNumber + "' INDEX = '1'></SMS></MESSAGE>");

                    result = SendNetCoreBulkSms(messageurl.ToString());
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
                if (result && netCoreResponseResult != null && netCoreResponseResult.MID != null && netCoreResponseResult.MID[0].TID != null && netCoreResponseResult.MID[0].ERROR != null)
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = netCoreResponseResult.MID[0].TID;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = netCoreResponseResult.MID[0].ERROR.ERROR.DESC;
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
                }
                else if (result && netCoreResponseResult != null && netCoreResponseResult.MID != null && netCoreResponseResult.MID[0].TID != null && netCoreResponseResult.MID[0].ERROR == null)
                {
                    VendorResponse.Id = smsSent.Id;
                    VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                    VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                    VendorResponse.ContactId = smsSent.ContactId;
                    VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                    VendorResponse.ResponseId = netCoreResponseResult.MID[0].TID;
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
                }
                else if (!string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
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
                    StringBuilder messageurl = new StringBuilder();
                    for (int i = 0; i < smsSentList.Count; i++)
                    {
                        string MessageContent = HelperForSMS.ReplaceOnlyXMLEncoding(smsSentList[i].MessageContent);
                        messageurl.Append("<MESSAGE><TEXT>" + MessageContent + "</TEXT><TYPE>0</TYPE><MID>" + i + "</MID><SMS FROM = '" + SmsConfiguration.Sender + "' TO = '" + smsSentList[i].PhoneNumber + "' INDEX = '1'></SMS></MESSAGE>");
                    }
                    result = SendNetCoreBulkSms(messageurl.ToString());
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
                    if (result && netCoreResponseResult != null && netCoreResponseResult.MID != null && netCoreResponseResult.MID[i].TID != null && netCoreResponseResult.MID[i].ERROR != null)
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = netCoreResponseResult.MID[i].TID;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = netCoreResponseResult.MID[i].ERROR.ERROR.DESC;
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
                    }
                    else if (result && netCoreResponseResult != null && netCoreResponseResult.MID != null && netCoreResponseResult.MID[i].TID != null && netCoreResponseResult.MID[i].ERROR == null)
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = netCoreResponseResult.MID[i].TID;
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
                    }
                    else if (!string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
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
                }
                VendorResponses.Add(VendorResponse);
            }
            #endregion Response ready
            return result;
        }

        private bool SendNetCoreBulkSms(string messageurl)
        {
            bool responseStatus = false;
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    string xmlDocument = "<!DOCTYPE REQ SYSTEM 'http://bulkpush.mytoday.com//BulkSms/BulkSmsV1.00.dtd'><REQ><VER>1.0</VER><USER><USERNAME>" + SmsConfiguration.UserName + "</USERNAME><PASSWORD>" + SmsConfiguration.Password + "</PASSWORD></USER><ACCOUNT><ID>" + SmsConfiguration.ApiKey + "</ID></ACCOUNT>" + messageurl.ToString() + "</REQ>";

                    string url = SmsConfiguration.ConfigurationUrl;

                    string xmlResponse = SendSmsByUrlNetCore(url, xmlDocument);

                    if (xmlResponse != null && xmlResponse != string.Empty)
                    {
                        XmlSerializer serializer = new XmlSerializer(typeof(NetCoreResult));
                        StringReader xmlResponses = new StringReader(xmlResponse);
                        netCoreResponseResult = (NetCoreResult)serializer.Deserialize(xmlResponses);
                        responseStatus = true;
                        ErrorMessage = string.Empty;
                    }
                    else
                    {
                        responseStatus = false;
                    }
                }
                else
                {
                    responseStatus = false;
                    ErrorMessage = "Message was trying to send before or after the time limit";
                }
            }
            catch (Exception ex)
            {
                responseStatus = false;
                ErrorMessage = ex.Message.ToString();
            }
            return responseStatus;
        }

        private string SendSmsByUrlNetCore(string url, string MessageInXML)
        {
            string resonseMessage = string.Empty;
            try
            {
                var client = new RestClient(url);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddParameter("xmlStr", MessageInXML);
                IRestResponse response = client.Execute(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    resonseMessage = response.Content;
                }
                else
                {
                    resonseMessage = string.Empty;
                    ErrorMessage = response.Content;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();
                resonseMessage = string.Empty;
            }
            return resonseMessage;
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

    #region NetCoreResponses
    [XmlRoot(ElementName = "RESULT")]
    public class NetCoreResult
    {
        [XmlElement(ElementName = "MID")]
        public List<NetCoreMid> MID { get; set; }
        public List<NetCoreError> REQUEST_ERROR { get; set; }
    }

    [XmlRoot(ElementName = "MID")]
    public class NetCoreMid
    {
        [XmlAttribute(AttributeName = "SUBMITDATE")]
        public string SUBMITDATE { get; set; }

        [XmlAttribute(AttributeName = "ID")]
        public string ID { get; set; }

        [XmlAttribute(AttributeName = "TAG")]
        public string TAG { get; set; }

        [XmlAttribute(AttributeName = "TID")]
        public string TID { get; set; }

        [XmlElement(ElementName = "ERROR")]
        public NetCoreErrors ERROR { get; set; }
    }

    public class NetCoreErrors
    {
        [XmlElement(ElementName = "ERROR")]
        public NetCoreError ERROR { get; set; }
    }

    [XmlRoot(ElementName = "ERROR")]
    public class NetCoreError
    {
        [XmlElement(ElementName = "CODE")]
        public string CODE { get; set; }

        [XmlElement(ElementName = "DESC")]
        public string DESC { get; set; }
    }

    public class NetCoreResponses
    {
        public string TID { get; set; }
        public string Error { get; set; }
    }
    #endregion
}