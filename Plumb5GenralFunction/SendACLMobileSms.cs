using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml;

namespace Plumb5GenralFunction
{
    public class SendACLMobileSms : IDisposable, IBulkSmsSending

    {
        #region Declaration
        readonly SmsConfiguration SmsConfigration;
        public string ErrorMessage { get; set; }
        public string AclMobileResponseId;
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        int AdsId = 0;
        #endregion Declaration

        public SendACLMobileSms(int adsId, SmsConfiguration currentSmsConfigration, string jobTagName = "campaign")
        {
            SmsConfigration = currentSmsConfigration;
            ErrorMessage = string.Empty;
            AclMobileResponseId = string.Empty;
            JobTagName = jobTagName;
            VendorResponses = new List<MLSmsVendorResponse>();
            AdsId = adsId;
        }

        public bool SendSingleSms(SmsSent smsSent)
        {
            bool result = false;
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfigration))
                {
                    StringBuilder messageUrl = new StringBuilder();

                    string MessageContent = HelperForSMS.ReplaceOnlyXMLEncoding(smsSent.MessageContent);
                    MessageContent = MessageContent.Replace("\n", "&#xA");
                    messageUrl.Append("<detail msisdn='" + smsSent.PhoneNumber + "' msg='" + MessageContent + "'/>");

                    string P5UniqueID = Guid.NewGuid().ToString();
                    string AdsIdandSettingId = P5UniqueID;

                    if (smsSent.SmsSendingSettingId > 0)
                        AdsIdandSettingId = (AdsId + "-" + smsSent.SmsSendingSettingId).ToString();

                    result = SendACLMobileBulkSms(AdsIdandSettingId, messageUrl.ToString());
                }
                else
                {
                    result = false;
                    ErrorMessage = "Message was trying to send before or after the time limit";
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendACLMobileSms"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "SendACLMobileSms->SendBulkSms->Exception", "");
                }
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
                    VendorResponse.ResponseId = AclMobileResponseId;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ErrorMessage;
                    VendorResponse.MessageContent = smsSent.MessageContent;
                    VendorResponse.SendStatus = 1;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                    VendorResponse.ResponseId = AclMobileResponseId;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = "";
                    VendorResponse.MessageContent = smsSent.MessageContent;
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfigration.ProviderName;
                    VendorResponse.SmsTemplateId = smsSent.SmsTemplateId;
                    VendorResponse.GroupId = 0;
                    VendorResponse.WorkFlowId = smsSent.WorkFlowId;
                    VendorResponse.WorkFlowDataId = smsSent.WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSent.MessageContent);
                    VendorResponse.P5SMSUniqueID = smsSent.P5SMSUniqueID;
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
                    VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                    VendorResponse.ResponseId = AclMobileResponseId;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ErrorMessage;
                    VendorResponse.MessageContent = smsSent.MessageContent;
                    VendorResponse.SendStatus = 4;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                VendorResponse.ResponseId = AclMobileResponseId;
                VendorResponse.NotDeliverStatus = 0;
                VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
                VendorResponse.MessageContent = smsSent.MessageContent;
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                if (Helper.IsSmsSendingTime(SmsConfigration))
                {
                    StringBuilder messageUrl = new StringBuilder();
                    for (int i = 0; i < smsSentList.Count; i++)
                    {
                        string MessageContent = HelperForSMS.ReplaceOnlyXMLEncoding(smsSentList[i].MessageContent);
                        //MessageContent = MessageContent.Replace("\n", "&#xA");
                        messageUrl.Append("<detail msisdn='" + smsSentList[i].PhoneNumber + "' msg='" + MessageContent + "'/>");
                    }

                    string P5UniqueID = Guid.NewGuid().ToString();
                    string AdsIdandSettingId = P5UniqueID;

                    if (smsSentList[0].SmsSendingSettingId > 0)
                        AdsIdandSettingId = (AdsId + "-" + smsSentList[0].SmsSendingSettingId).ToString();

                    result = SendACLMobileBulkSms(AdsIdandSettingId, messageUrl.ToString());
                }
                else
                {
                    result = false;
                    ErrorMessage = "Message was trying to send before or after the time limit";
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendACLMobileSms"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "SendACLMobileSms->SendBulkSms->Exception", "");
                }
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
                        VendorResponse.ResponseId = AclMobileResponseId;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = ErrorMessage;
                        VendorResponse.MessageContent = smsSentList[i].MessageContent;
                        VendorResponse.SendStatus = 1;
                        VendorResponse.ProductIds = "";
                        VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                        VendorResponse.ResponseId = AclMobileResponseId;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = "";
                        VendorResponse.MessageContent = smsSentList[i].MessageContent;
                        VendorResponse.SendStatus = 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.VendorName = SmsConfigration.ProviderName;
                        VendorResponse.SmsTemplateId = smsSentList[i].SmsTemplateId;
                        VendorResponse.GroupId = 0;
                        VendorResponse.WorkFlowId = smsSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = smsSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSentList[i].MessageContent);
                        VendorResponse.P5SMSUniqueID = smsSentList[i].P5SMSUniqueID;
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
                        VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                        VendorResponse.ResponseId = AclMobileResponseId;
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = ErrorMessage;
                        VendorResponse.MessageContent = smsSentList[i].MessageContent;
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.VendorName = SmsConfigration.ProviderName;
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
                    VendorResponse.ResponseId = AclMobileResponseId;
                    VendorResponse.NotDeliverStatus = 0;
                    VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
                    VendorResponse.MessageContent = smsSentList[i].MessageContent;
                    VendorResponse.SendStatus = 4;
                    VendorResponse.ProductIds = "";
                    VendorResponse.VendorName = SmsConfigration.ProviderName;
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

        private bool SendACLMobileBulkSms(string AdsIdandSettingId, string message)
        {
            bool responseStatus = false;
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfigration))
                {


                    //string xmlDocument = "xmlStr=<?xml version='1.0'?><push><appid>" + SmsConfigration.UserName + "</appid><subappid>" + SmsConfigration.UserName + "</subappid><userid>" + SmsConfigration.UserName + "</userid><pass>" + SmsConfigration.Password + "</pass><acct-type>1</acct-type><msgid>" + AdsIdandSettingId + "</msgid><content-type>1</content-type><priority>true</priority><masking>true</masking><from>" + SmsConfigration.Sender + "</from><multisms>" + message + "</multisms><dlr>true</dlr><alert>1</alert><intflag>false</intflag></push>";
                    //string encodeUrl = ReplaceACLMobilexml(xmlDocument);
                    //string url = SmsConfigration.ConfigurationUrl + xmlDocument;
                    string xmlData = "<?xml version='1.0'?><push><appid>" + SmsConfigration.UserName + "</appid><subappid>" + SmsConfigration.UserName + "</subappid><userid>" + SmsConfigration.UserName + "</userid><pass>" + SmsConfigration.Password + "</pass><acct-type>1</acct-type><msgid>" + AdsIdandSettingId + "</msgid><content-type>1</content-type><priority>true</priority><masking>true</masking><from>" + SmsConfigration.Sender + "</from><multisms>" + message + "</multisms><dlr>true</dlr><alert>1</alert><intflag>false</intflag></push>";

                    string Aclconfigurl = SmsConfigration.ConfigurationUrl;

                    string xmlResponse = SendSmsByUrlACLMobile(xmlData, Aclconfigurl);
                    if (xmlResponse != null && xmlResponse != string.Empty)
                    {
                        XElement xml = XElement.Parse(xmlResponse);
                        int status = int.Parse(xml.Element("status").Value);
                        if (status == 1)
                        {
                            responseStatus = true;
                            AclMobileResponseId = xml.Element("response-id").Value;
                        }
                        else
                        {
                            XmlDocument xm = new XmlDocument();
                            xm.LoadXml(xmlResponse);
                            XmlNodeList xnList = xm.SelectNodes("/push/error");
                            foreach (XmlNode xn in xnList)
                            {
                                string errorcode = xn["code"].InnerText;
                                string description = xn["description"].InnerText;
                                responseStatus = false;
                                ErrorMessage = "StatusCode=" + errorcode + " ErrorMessage=" + description;

                            }
                            using (ErrorUpdation objError = new ErrorUpdation("SendACLMobileSms"))
                            {
                                objError.AddError(ErrorMessage.ToString(), "", DateTime.Now.ToString(), "SendACLMobileSms->SendACLMobileBulkSms", "");
                            }
                        }
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
                using (ErrorUpdation objError = new ErrorUpdation("SendACLMobileSms"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "SendACLMobileSms->SendACLMobileBulkSms->Exception", "");
                }
                responseStatus = false;
                ErrorMessage = ex.Message.ToString();
            }
            return responseStatus;
        }

        private string SendSmsByUrlACLMobile(string xmlData, string configUrl)
        {
            string resonseMessage = string.Empty;
            try
            {
                //WebRequest request = WebRequest.Create(url);
                //request.Method = "POST";
                //request.Credentials = CredentialCache.DefaultCredentials;
                //using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                //{
                //    Stream dataStream = response.GetResponseStream();
                //    if (dataStream != null)
                //    {
                //        using (StreamReader reader = new StreamReader(dataStream))
                //        {
                //            resonseMessage = reader.ReadToEnd();
                //            reader.Close();
                //            dataStream.Close();
                //            response.Close();
                //        }
                //    }
                //    else
                //    {
                //        resonseMessage = null;
                //    }
                //    dataStream = null;
                //}
                //request = null;
                //url = null;

                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                       | SecurityProtocolType.Tls11
                       | SecurityProtocolType.Tls12;


                var client = new RestClient(configUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/xml");
                var body = xmlData;
                request.AddParameter("application/xml", body, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
                // convert string to stream
                byte[] byteArray = Encoding.UTF8.GetBytes(response.Content);
                //byte[] byteArray = Encoding.ASCII.GetBytes(contents);
                MemoryStream stream = new MemoryStream(byteArray);
                if (stream != null)
                {
                    // convert stream to string
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        resonseMessage = reader.ReadToEnd();
                        reader.Close();
                        stream.Close();
                    }
                }
                else
                {
                    resonseMessage = null;
                }
                stream = null;

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendACLMobileSms"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "SendACLMobileSms->SendSmsByUrlACLMobile->Exception", "");
                }
                ErrorMessage = ex.Message.ToString();
                resonseMessage = string.Empty;
            }
            return resonseMessage;
        }

        private string ReplaceACLMobilexml(string data)
        {
            StringBuilder urlData = new StringBuilder();
            urlData.Append(data);
            urlData.Replace("\"", "&quot;").Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("©", "&copy;").Replace("´", "&acute;").Replace("«", "&laquo;").Replace("»", "&raquo;");
            urlData.Replace("¡", " &iexcl;").Replace("¿", "&iquest;").Replace("À", "&Agrave;").Replace("à", "&agrave;").Replace("Á", "&Aacute;").Replace("á", "&aacute;").Replace("Â", "&Acirc;").Replace("â", "&acirc;");
            urlData.Replace("Ã", "&Atilde;").Replace("ã", "&atilde;").Replace("Ä", "&Auml;").Replace("ä", "&auml;");
            return urlData.ToString();
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

