using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using P5GenralML;
using RestSharp;
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

    public class SendValueFirstSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly SmsConfiguration SmsConfiguration;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        public ValueFirstResponse valueFirsResponseResult = null;
        public int AccountId;
        #endregion Declaration

        public SendValueFirstSms(int adsid, SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            AccountId = adsid;
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            VendorResponses = new List<MLSmsVendorResponse>();
            valueFirsResponseResult = new ValueFirstResponse();
            ErrorMessage = string.Empty;
        }

        public bool SendBulkSms(List<SmsSent> smsSentList)
        {
            bool result = false;
            ValueFirstRequestBody reqbody = new ValueFirstRequestBody();
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    List<SMS> smsList = new List<SMS>();

                    for (int i = 0; i < smsSentList.Count; i++)
                    {
                        ADDRESS aDDRESS = new ADDRESS();
                        aDDRESS.@FROM = SmsConfiguration.Sender;
                        aDDRESS.@TO = smsSentList[i].PhoneNumber;
                        aDDRESS.@SEQ = "1";
                        aDDRESS.@TAG = $"{AccountId}";

                        SMS sms = new SMS();
                        sms.@TEXT = smsSentList[i].MessageContent;
                        sms.ADDRESS = new List<ADDRESS> { aDDRESS };
                        smsList.Add(sms);
                    }

                    reqbody.SMS = smsList;
                    result = SendValueFirstBulkSms(reqbody);
                }
            }
            catch (Exception ex)
            {
                result = false;
                ErrorMessage = ex.Message.ToString();
            }

            #region Response Ready
            //Put the response data in VendorResponses
            for (int i = 0; i < smsSentList.Count; i++)
            {
                MLSmsVendorResponse VendorResponse = new MLSmsVendorResponse();
                try
                {
                    if (result && valueFirsResponseResult != null && valueFirsResponseResult.MESSAGEACK != null && valueFirsResponseResult.MESSAGEACK.GUID != null && valueFirsResponseResult.MESSAGEACK.GUID.Count > 0)
                    {
                        if (valueFirsResponseResult.MESSAGEACK.GUID.Count > 0)
                        {
                            if (valueFirsResponseResult.MESSAGEACK.GUID[i].ERROR != null)
                            {
                                ErrorMessage = GetErrorCodeMessage(Convert.ToInt32(valueFirsResponseResult.MESSAGEACK.GUID[i].ERROR.CODE));
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(valueFirsResponseResult.MESSAGEACK.GUID[i].GUID);
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
                                VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
                            }
                            else
                            {
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(valueFirsResponseResult.MESSAGEACK.GUID[i].GUID);
                                VendorResponse.NotDeliverStatus = 0;
                                VendorResponse.ReasonForNotDelivery = "Submitted to vendor";
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
                                VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
                            }
                        }
                        else
                        {
                            ErrorMessage = GetErrorCodeMessage(Convert.ToInt32(valueFirsResponseResult.MESSAGEACK.Err.Code));
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(valueFirsResponseResult.MESSAGEACK.GUID[i].GUID);
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
                            VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
                        }
                    }
                    else if (!result && valueFirsResponseResult != null && valueFirsResponseResult.MESSAGEACK != null && valueFirsResponseResult.MESSAGEACK.Err != null)
                    {
                        ErrorMessage = GetErrorCodeMessage(Convert.ToInt32(valueFirsResponseResult.MESSAGEACK.Err.Code));
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
                        VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
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
                        VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
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
                        VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
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
                        VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
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
                    VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSentList[i].MessageContent);
                }
                VendorResponses.Add(VendorResponse);
            }
            #endregion Response ready

            return result;
        }

        public bool SendSingleSms(SmsSent smsSent)
        {
            bool result = false;
            try
            {
                List<SmsSent> smsSentList = new List<SmsSent> { smsSent };
                result = SendBulkSms(smsSentList);
            }
            catch (Exception ex)
            {
                result = false;
                ErrorMessage = ex.Message.ToString();
            }

            return result;
        }

        private bool SendValueFirstBulkSms(ValueFirstRequestBody DataList)
        {
            bool responseStatus = false;
            try
            {
                var client = new RestClient(SmsConfiguration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", $"Bearer {SmsConfiguration.ApiKey}");
                var jsonBody = JsonConvert.SerializeObject(DataList);
                request.AddParameter("application/json", jsonBody, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
                var result = response.Content;
                dynamic ResponseResult = JsonConvert.DeserializeObject(result);

                if (ResponseResult != null && ResponseResult.MESSAGEACK != null && ResponseResult.MESSAGEACK.GUID != null)
                {
                    try
                    {
                        if (ResponseResult.MESSAGEACK.GUID.GetType() == typeof(JArray))
                        {
                            valueFirsResponseResult = JsonConvert.DeserializeObject<ValueFirstResponse>(result);
                            responseStatus = true;
                        }
                        else if (ResponseResult.MESSAGEACK.GUID.GetType() == typeof(JObject))
                        {
                            GUIDS gUIDS = new GUIDS
                            {
                                SUBMITDATE = Convert.ToString(ResponseResult.MESSAGEACK.GUID.SUBMITDATE),
                                GUID = Convert.ToString(ResponseResult.MESSAGEACK.GUID.GUID),
                                ID = Convert.ToInt32(ResponseResult.MESSAGEACK.GUID.ID),
                            };

                            if (ResponseResult.MESSAGEACK.GUID.ERROR != null)
                            {
                                gUIDS.ERROR = new ERROR
                                {
                                    CODE = Convert.ToInt32(ResponseResult.MESSAGEACK.GUID.ERROR.CODE),
                                    SEQ = Convert.ToInt32(ResponseResult.MESSAGEACK.GUID.ERROR.SEQ),
                                };

                                ErrorMessage = GetErrorCodeMessage(Convert.ToInt32(ResponseResult.MESSAGEACK.GUID.ERROR.CODE));
                            }
                            else
                                responseStatus = true;

                            List<GUIDS> GUIDs = new List<GUIDS> { gUIDS };
                            MESSAGEACK ojb = new MESSAGEACK();
                            ojb.GUID = GUIDs;
                            valueFirsResponseResult.MESSAGEACK = ojb;
                        }
                    }
                    catch (Exception ex)
                    {
                        responseStatus = false;
                        ErrorMessage = ex.Message.ToString();
                    }
                }
                else
                {
                    valueFirsResponseResult = JsonConvert.DeserializeObject<ValueFirstResponse>(result);
                    responseStatus = false;
                }
            }
            catch (Exception ex)
            {
                responseStatus = false;
                ErrorMessage = ex.Message.ToString();
            }
            return responseStatus;
        }


        public static string GetErrorCodeMessage(int code)
        {
            string Message = "";
            switch (code)
            {
                case 52992:
                    Message = "Username/Password incorrect";
                    break;
                case 57089:
                    Message = "Contract expired";
                    break;
                case 57090:
                    Message = "User credit expired";
                    break;
                case 57091:
                    Message = "User disabled";
                    break;
                case 65280:
                    Message = "Service is temporarily unavailable";
                    break;
                case 65535:
                    Message = "The specified message does not conform to DTD";
                    break;
                case 0:
                    Message = "SMS submitted success NO Error Not returned in ValueFirst XML API";
                    break;
                case 28673:
                    Message = "Destination number not numeric";
                    break;
                case 28674:
                    Message = "Destination number empty";
                    break;
                case 28675:
                    Message = "Sender address empty";
                    break;
                case 28676:
                    Message = "Template mismatch";
                    break;
                case 28677:
                    Message = "UDH is invalid / SPAM message";
                    break;
                case 28678:
                    Message = "Coding is invalid";
                    break;
                case 28679:
                    Message = "SMS text is empty";
                    break;
                case 28680:
                    Message = "Invalid sender ID";
                    break;
                case 28681:
                    Message = "Invalid message, Duplicate message, Submit failed";
                    break;
                case 28682:
                    Message = "Invalid Receiver ID Will validate Indian mobile numbers only";
                    break;
                case 28683:
                    Message = "Invalid Date time for message Schedule (If the date specified in message post for schedule delivery is less than current date or more than expiry date or more than 1 year)";
                    break;
                case 28684:
                    Message = "Invalid SMS Block";
                    break;
                case 28694:
                    Message = "If occurred any error , related to TEMPLATEINFO parameter, which include like invalid template id is provided, variables count mismatch than the template Text variables count, template text not found for the given template id.";
                    break;
                case 28702:
                    Message = "Invalid DLT Parameters";
                    break;
                case 28703:
                    Message = "Invalid DLT Content Type";
                    break;
                case 28704:
                    Message = "Invalid Authorization Type(If message is rejected due to authorization scheme other than Authorization header)";
                    break;
                case 8448:
                    Message = "Message delivered successfully";
                    break;
                case 8449:
                    Message = "Message failed";
                    break;
                case 8450:
                    Message = "Message ID is invalid";
                    break;
                case 13568:
                    Message = "Command completed successfully";
                    break;
                case 13569:
                    Message = "Cannot update/delete schedule since it has already been processed";
                    break;
                case 13570:
                    Message = "Cannot update schedule since the new date-time parameter is incorrect";
                    break;
                case 13571:
                    Message = "Invalid SMS ID/GUID";
                    break;
                case 13572:
                    Message = "Invalid Status type for schedule search query. The status strings can be “PROCESSED”, “PENDING” and “ERROR”";
                    break;
                case 13573:
                    Message = "Invalid date time parameter for schedule search query";
                    break;
                case 13574:
                    Message = "Invalid GUID for GUID search query";
                    break;
                case 13575:
                    Message = "Invalid command action";
                    break;
                case 001:
                    Message = "Invalid_number";
                    break;
                case 002:
                    Message = "Absent_subscriber";
                    break;
                case 003:
                    Message = "Emory_capacity_exceeded";
                    break;
                case 004:
                    Message = "Mobile_equipment_error";
                    break;
                case 005:
                    Message = "Network_error";
                    break;
                case 006:
                    Message = "Barring";
                    break;
                case 007:
                    Message = "Invalid_senderid";
                    break;
                case 008:
                    Message = "Dropped";
                    break;
                case 009:
                    Message = "Ndnc_failed";
                    break;
                case 100:
                    Message = "Misc. Error";
                    break;
                case 110:
                    Message = "Entity not found";
                    break;
                case 111:
                    Message = "Entity not registered";
                    break;
                case 112:
                    Message = "Entity inactive";
                    break;
                case 113:
                    Message = "Entity blacklisted";
                    break;
                case 114:
                    Message = "Invalid telemarketer";
                    break;
                case 115:
                    Message = "Header not found";
                    break;
                case 116:
                    Message = "Header inactive";
                    break;
                case 117:
                    Message = "Header blacklisted";
                    break;
                case 118:
                    Message = "Template not found";
                    break;
                case 119:
                    Message = "Template inactive";
                    break;
                case 120:
                    Message = "Template not matched";
                    break;
                case 121:
                    Message = "Template blacklisted";
                    break;
                case 122:
                    Message = "Invalid consent";
                    break;
                case 123:
                    Message = "General consent error";
                    break;
                case 124:
                    Message = "DLT miscellaneous error";
                    break;

            }

            return Message;
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

    #region ValueFirst Request Body
    public class ValueFirstRequestBody
    {
        [JsonProperty("@VER")]
        public string VER { get; set; } = "1.2";
        public object USER { get; set; } = new { };
        public DLR DLR { get; set; } = new DLR { URL = "" };
        public List<SMS> SMS { get; set; }
    }

    public class DLR
    {
        [JsonProperty("@URL")]
        public string URL { get; set; }
    }

    public class SMS
    {
        [JsonProperty("@UDH")]
        public string UDH { get; set; } = "0";

        [JsonProperty("@USERNAME")]
        public string USERNAME { get; set; } = "";

        [JsonProperty("@PASSWORD")]
        public string PASSWORD { get; set; } = "";

        [JsonProperty("@CODING")]
        public string CODING { get; set; } = "1";

        [JsonProperty("@TEXT")]
        public string TEXT { get; set; }

        [JsonProperty("@PROPERTY")]
        public string PROPERTY { get; set; } = "0";

        [JsonProperty("@ID")]
        public string ID { get; set; } = "1";

        public List<ADDRESS> ADDRESS { get; set; }
    }

    public class ADDRESS
    {
        [JsonProperty("@FROM")]
        public string FROM { get; set; }

        [JsonProperty("@TO")]
        public string TO { get; set; }

        [JsonProperty("@SEQ")]
        public string SEQ { get; set; }

        [JsonProperty("@TAG")]
        public string TAG { get; set; }
    }

    #endregion


    #region Response Body
    public class ValueFirstResponse
    {
        public MESSAGEACK MESSAGEACK { get; set; }
    }

    public class MESSAGEACK
    {
        public List<GUIDS> GUID { get; set; }
        public Err Err { get; set; }
    }

    public class GUIDS
    {
        public string SUBMITDATE { get; set; }
        public string GUID { get; set; }
        public int ID { get; set; }
        public ERROR ERROR { get; set; }
    }

    public class ERROR
    {
        public int CODE { get; set; }
        public int SEQ { get; set; }
    }
    public class Err
    {
        public string Desc { get; set; }
        public int Code { get; set; }
    }

    #endregion
}
