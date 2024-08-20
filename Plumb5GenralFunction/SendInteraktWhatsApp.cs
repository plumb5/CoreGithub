using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendInteraktWhatsApp : IDisposable, IBulkWhatsAppSending
    {
        #region Declaration
        readonly int AccountId;
        readonly WhatsAppConfiguration whatsappConfiguration;
        public InteraktResponse interaktResponse;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLWhatsAppVendorResponse> VendorResponses { get; set; }
        #endregion Declaration

        public SendInteraktWhatsApp(int accountId, WhatsAppConfiguration whatsappConfig, string jobTagName = "campaign")
        {
            AccountId = accountId;
            whatsappConfiguration = whatsappConfig;
            JobTagName = jobTagName;
            ErrorMessage = string.Empty;
            interaktResponse = new InteraktResponse();
            VendorResponses = new List<MLWhatsAppVendorResponse>();
        }

        public bool SendWhatsApp(List<MLWhatsappSent> whatsappSent)
        {
            bool result = false;
            try
            {
                if (Helper.IsWhatsAppSendingTime(whatsappConfiguration))
                {
                    for (int i = 0; i < whatsappSent.Count; i++)
                    {
                        result = SendEachWhatsApp(whatsappSent[i]);

                        //Put the response data in VendorResponses
                        //#region Response Ready

                        MLWhatsAppVendorResponse VendorResponse = new MLWhatsAppVendorResponse();
                        try
                        {
                            if (result && interaktResponse != null && interaktResponse.id != null)
                            {
                                if (!String.IsNullOrEmpty(interaktResponse.id) && interaktResponse.result == "true")
                                {
                                    VendorResponse.Id = whatsappSent[i].Id;
                                    VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                                    VendorResponse.ContactId = whatsappSent[i].ContactId;
                                    VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                                    VendorResponse.ResponseId = interaktResponse.id;
                                    VendorResponse.ErrorMessage = "";
                                    VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                                    VendorResponse.SendStatus = 1;
                                    VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                                    VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                                    VendorResponse.GroupId = whatsappSent[i].GroupId;
                                    VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                                    VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                                    VendorResponse.CampaignJobName = JobTagName;
                                    VendorResponse.IsDelivered = 0;
                                    VendorResponse.IsClicked = 0;
                                    VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                                    VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                                    VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                                    VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                                    VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                                }
                                else if (interaktResponse.result == "false" && !string.IsNullOrEmpty(interaktResponse.message))
                                {
                                    ErrorMessage = interaktResponse.message;
                                    VendorResponse.Id = whatsappSent[i].Id;
                                    VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                                    VendorResponse.ContactId = whatsappSent[i].ContactId;
                                    VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                                    VendorResponse.ResponseId = "";
                                    VendorResponse.ErrorMessage = ErrorMessage;
                                    VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                                    VendorResponse.SendStatus = 0;
                                    VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                                    VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                                    VendorResponse.GroupId = whatsappSent[i].GroupId;
                                    VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                                    VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                                    VendorResponse.CampaignJobName = JobTagName;
                                    VendorResponse.IsDelivered = 0;
                                    VendorResponse.IsClicked = 0;
                                    VendorResponse.IsFailed = 1;
                                    VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                                    VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                                    VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                                    VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                                    VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                                }
                            }
                            else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                            {
                                VendorResponse.Id = whatsappSent[i].Id;
                                VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                                VendorResponse.ContactId = whatsappSent[i].ContactId;
                                VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                                VendorResponse.ResponseId = "";
                                VendorResponse.ErrorMessage = "Message was trying to send before or after the time limit";
                                VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                                VendorResponse.SendStatus = 0;
                                VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                                VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                                VendorResponse.GroupId = whatsappSent[i].GroupId;
                                VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                                VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                                VendorResponse.CampaignJobName = JobTagName;
                                VendorResponse.IsDelivered = 0;
                                VendorResponse.IsClicked = 0;
                                VendorResponse.IsFailed = 1;
                                VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                                VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                                VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                                VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                                VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                            }
                            else if (!result)
                            {
                                VendorResponse.Id = whatsappSent[i].Id;
                                VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                                VendorResponse.ContactId = whatsappSent[i].ContactId;
                                VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                                VendorResponse.ResponseId = "";
                                VendorResponse.ErrorMessage = ErrorMessage;
                                VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                                VendorResponse.SendStatus = 0;
                                VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                                VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                                VendorResponse.GroupId = whatsappSent[i].GroupId;
                                VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                                VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                                VendorResponse.CampaignJobName = JobTagName;
                                VendorResponse.IsDelivered = 0;
                                VendorResponse.IsClicked = 0;
                                VendorResponse.IsFailed = 1;
                                VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                                VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                                VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                                VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                                VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                            }
                            else
                            {
                                VendorResponse.Id = whatsappSent[i].Id;
                                VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                                VendorResponse.ContactId = whatsappSent[i].ContactId;
                                VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                                VendorResponse.ResponseId = "";
                                VendorResponse.ErrorMessage = String.IsNullOrEmpty(interaktResponse.message) ? ErrorMessage : "No responses I’d from the vendor server";
                                VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                                VendorResponse.SendStatus = 4;
                                VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                                VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                                VendorResponse.GroupId = whatsappSent[i].GroupId;
                                VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                                VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                                VendorResponse.CampaignJobName = JobTagName;
                                VendorResponse.IsDelivered = 0;
                                VendorResponse.IsClicked = 0;
                                VendorResponse.IsFailed = 1;
                                VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                                VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                                VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                                VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                                VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                            }
                        }
                        catch (Exception ex)
                        {
                            VendorResponse.Id = whatsappSent[i].Id;
                            VendorResponse.WhatsappSendingSettingId = whatsappSent[i].WhatsappSendingSettingId;
                            VendorResponse.ContactId = whatsappSent[i].ContactId;
                            VendorResponse.PhoneNumber = whatsappSent[i].PhoneNumber;
                            VendorResponse.ResponseId = "";
                            VendorResponse.ErrorMessage = ex.Message.ToString();
                            VendorResponse.MessageContent = whatsappSent[i].MessageContent;
                            VendorResponse.SendStatus = 4;
                            VendorResponse.VendorName = whatsappConfiguration.ProviderName;
                            VendorResponse.WhatsappTemplateId = whatsappSent[i].WhatsappTemplateId;
                            VendorResponse.GroupId = whatsappSent[i].GroupId;
                            VendorResponse.WorkFlowId = whatsappSent[i].WorkFlowId;
                            VendorResponse.WorkFlowDataId = whatsappSent[i].WorkFlowDataId;
                            VendorResponse.CampaignJobName = JobTagName;
                            VendorResponse.IsDelivered = 0;
                            VendorResponse.IsClicked = 0;
                            VendorResponse.IsFailed = 1;
                            VendorResponse.MediaFileURL = whatsappSent[i].MediaFileURL;
                            VendorResponse.UserAttributes = whatsappSent[i].UserAttributes;
                            VendorResponse.ButtonOneDynamicURLSuffix = whatsappSent[i].ButtonOneDynamicURLSuffix;
                            VendorResponse.ButtonTwoDynamicURLSuffix = whatsappSent[i].ButtonTwoDynamicURLSuffix;
                            VendorResponse.P5WhatsappUniqueID = whatsappSent[i].P5WhatsappUniqueID;
                        }
                        VendorResponses.Add(VendorResponse);
                        //#endregion Response ready
                    }
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
            return result;
        }

        public bool SendEachWhatsApp(MLWhatsappSent whatsappSent)
        {
            bool responseStatus = false;

            try
            {
                JArray JArrayDataList = new JArray();
                JObject EachJObject = new JObject();

                EachJObject["name"] = whatsappSent.WhiteListedTemplateName;
                EachJObject["languageCode"] = whatsappSent.LanguageCode;

                if (!string.IsNullOrEmpty(whatsappSent.MediaFileURL))
                    EachJObject["headerValues"] = JArray.FromObject(new List<string> { whatsappSent.MediaFileURL });

                if (!string.IsNullOrEmpty(whatsappSent.UserAttributes))
                {
                    if (whatsappSent.UserAttributes.IndexOf("$@$") > -1)
                    {
                        string[] userattr = whatsappSent.UserAttributes.Split(new[] { "$@$" }, StringSplitOptions.None);

                        List<string> userlist = new List<string>();

                        if (userattr != null && userattr.Length > 0)
                        {
                            for (int i = 0; i < userattr.Length; i++)
                                userlist.Add(userattr[i]);
                        }

                        EachJObject["bodyValues"] = JArray.FromObject(userlist);
                    }
                    else
                    {
                        EachJObject["bodyValues"] = JArray.FromObject(new List<string> { whatsappSent.UserAttributes });
                        //EachJObject["bodyValues"] = JArray.FromObject(new List<string> { whatsappSent.UserAttributes.Split(',')[0], whatsappSent.UserAttributes.Split(',')[1], whatsappSent.UserAttributes.Split(',')[2] });
                    }
                }

                JObject EachsubJObject = new JObject();

                //if (!string.IsNullOrEmpty(whatsappSent.ButtonOneText))
                //    EachsubJObject["0"] = JArray.FromObject(new List<string> { whatsappSent.ButtonOneText });

                //if (!string.IsNullOrEmpty(whatsappSent.ButtonTwoText))
                //    EachsubJObject["1"] = JArray.FromObject(new List<string> { whatsappSent.ButtonTwoText });

                if (!string.IsNullOrEmpty(whatsappSent.ButtonOneDynamicURLSuffix))
                    EachsubJObject["0"] = JArray.FromObject(new List<string> { whatsappSent.ButtonOneDynamicURLSuffix });

                if (!string.IsNullOrEmpty(whatsappSent.ButtonTwoDynamicURLSuffix))
                    EachsubJObject["1"] = JArray.FromObject(new List<string> { whatsappSent.ButtonTwoDynamicURLSuffix });

                EachJObject["buttonValues"] = EachsubJObject;
                JArrayDataList.Add(EachJObject);

                JObject SendingJObject = new JObject();
                SendingJObject["countryCode"] = whatsappSent.CountryCode;
                SendingJObject["phoneNumber"] = whatsappSent.PhoneNumber;
                SendingJObject["callbackData"] = AccountId.ToString();
                SendingJObject["type"] = "Template";
                SendingJObject["template"] = EachJObject;

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var client = new RestClient(whatsappConfiguration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("content-type", "application/json");
                request.AddHeader("authorization", "Basic " + whatsappConfiguration.ApiKey);
                request.AddParameter("application/json", SendingJObject.ToString(), ParameterType.RequestBody);
                IRestResponse InteraktWhatsappResponse = client.Execute(request);

                if (InteraktWhatsappResponse.StatusCode == HttpStatusCode.Created)
                {
                    interaktResponse = JsonConvert.DeserializeObject<InteraktResponse>(InteraktWhatsappResponse.Content);
                    responseStatus = true;
                }
                else
                {
                    responseStatus = false;
                    ErrorMessage = "StatusCode=" + InteraktWhatsappResponse.StatusCode + "ErrorMessage=" + InteraktWhatsappResponse.Content;
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
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }

    public class WhatsAppSetting
    {
        public int WhatsAppTemplateId { get; set; }
    }
    public class InteraktResponse
    {
        public string result { get; set; }
        public string message { get; set; }
        public string id { get; set; }
    }
}
