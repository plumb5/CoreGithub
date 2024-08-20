using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendDigiSpiceSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly SmsConfiguration SmsConfiguration;
        public DigiSpiceResult digiSpiceResponseResult;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        public readonly int AccountId;
        #endregion Declaration

        public SendDigiSpiceSms(int accountId, SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            digiSpiceResponseResult = new DigiSpiceResult();
            VendorResponses = new List<MLSmsVendorResponse>();
            ErrorMessage = string.Empty;
            AccountId = accountId;
        }

        public bool SendSingleSms(SmsSent smsSent)
        {
            bool result = false;
            try
            {
                if (Helper.IsSmsSendingTime(SmsConfiguration))
                {
                    List<DigiSpiceMessage> JArrayDataList = new List<DigiSpiceMessage>();

                    DigiSpiceMessage EachJObject = new DigiSpiceMessage();
                    EachJObject.to = new string[] { string.Format("91{0}", smsSent.PhoneNumber) };
                    EachJObject.variables = new Messages { MESSAGE = smsSent.MessageContent };
                    JArrayDataList.Add(EachJObject);

                    DigiSpiceRequest digiSpiceRequest = new DigiSpiceRequest();
                    digiSpiceRequest.sender_id = SmsConfiguration.Sender;
                    digiSpiceRequest.type = "text";
                    digiSpiceRequest.message = "[%MESSAGE%]";
                    digiSpiceRequest.recipient = JArrayDataList;
                    digiSpiceRequest.label = Convert.ToString(AccountId);
                    digiSpiceRequest.country_specific = new List<CountrySpecific> { new CountrySpecific() { country = "91", entity_id = SmsConfiguration.EntityId, template_id = smsSent.VendorTemplateId } };

                    result = SendDigiSpiceBulkSms(digiSpiceRequest);
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
                if (result && digiSpiceResponseResult != null && digiSpiceResponseResult.recipients != null && digiSpiceResponseResult.recipients.Count > 0)
                {
                    if (digiSpiceResponseResult.status.ToLower().Contains("success"))
                    {
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                        VendorResponse.ContactId = smsSent.ContactId;
                        VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                        VendorResponse.ResponseId = Convert.ToString(digiSpiceResponseResult.recipients[0].message_id);
                        VendorResponse.NotDeliverStatus = 0;
                        VendorResponse.ReasonForNotDelivery = digiSpiceResponseResult.status;
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
                        ErrorMessage = digiSpiceResponseResult.status;
                        VendorResponse.Id = smsSent.Id;
                        VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                        VendorResponse.ContactId = smsSent.ContactId;
                        VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                        ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients[0].message_id) : ErrorMessage;
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
                    ErrorMessage = VendorResponse.ReasonForNotDelivery = "Message was trying to send before or after the time limit";
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
                    ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients[0].message_id) : ErrorMessage;
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
                    ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients[0].message_id) : ErrorMessage;
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
                ErrorMessage = VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
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
                    List<DigiSpiceMessage> JArrayDataList = new List<DigiSpiceMessage>();

                    for (int i = 0; i < smsSentList.Count; i++)
                    {
                        if (!String.IsNullOrEmpty(smsSentList[i].PhoneNumber) && smsSentList[i].PhoneNumber.Length == 10)
                        {
                            DigiSpiceMessage EachJObject = new DigiSpiceMessage();
                            EachJObject.to = new string[] { string.Format("91{0}", smsSentList[i].PhoneNumber) };
                            EachJObject.variables = new Messages { MESSAGE = smsSentList[i].MessageContent };
                            JArrayDataList.Add(EachJObject);
                        }
                        else
                        {
                            smsSentList[i].ReasonForNotDelivery = "Invalid phone number";
                        }
                    }

                    DigiSpiceRequest digiSpiceRequest = new DigiSpiceRequest();
                    digiSpiceRequest.sender_id = SmsConfiguration.Sender;
                    digiSpiceRequest.type = "text";
                    digiSpiceRequest.message = "[%MESSAGE%]";
                    digiSpiceRequest.recipient = JArrayDataList;
                    digiSpiceRequest.label = Convert.ToString(AccountId);
                    digiSpiceRequest.country_specific = new List<CountrySpecific> { new CountrySpecific() { country = "91", entity_id = SmsConfiguration.EntityId, template_id = smsSentList[0].VendorTemplateId } };
                    result = SendDigiSpiceBulkSms(digiSpiceRequest);
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
                    if (!String.IsNullOrEmpty(smsSentList[i].ReasonForNotDelivery) && smsSentList[i].ReasonForNotDelivery.ToLower().Contains("invalid phone number"))
                    {
                        VendorResponse.Id = smsSentList[i].Id;
                        VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                        VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                        VendorResponse.ContactId = smsSentList[i].ContactId;
                        VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                        VendorResponse.ResponseId = "";
                        VendorResponse.NotDeliverStatus = 0;
                        ErrorMessage = VendorResponse.ReasonForNotDelivery = smsSentList[i].ReasonForNotDelivery;
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
                        if (result && digiSpiceResponseResult != null && digiSpiceResponseResult.recipients != null && digiSpiceResponseResult.recipients.Count > 0)
                        {
                            if (digiSpiceResponseResult.status.ToLower().Contains("success") && !String.IsNullOrEmpty(digiSpiceResponseResult.request_id) && Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id).ToLower() != "na")
                            {
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id);
                                VendorResponse.NotDeliverStatus = 0;
                                VendorResponse.ReasonForNotDelivery = digiSpiceResponseResult.status;
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
                                ErrorMessage = Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id).ToLower() == "na" ? "Failure" : digiSpiceResponseResult.status;
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id);
                                VendorResponse.NotDeliverStatus = 0;
                                ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id) : ErrorMessage;
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
                        else if (!result && digiSpiceResponseResult.status.ToLower().Contains("failure"))
                        {
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = "";
                            VendorResponse.NotDeliverStatus = 0;
                            ErrorMessage = VendorResponse.ReasonForNotDelivery = digiSpiceResponseResult.recipients[0].message_id;
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
                        else if (!result && !string.IsNullOrEmpty(ErrorMessage) && ErrorMessage.Contains("Message was trying to send before or after the time limit"))
                        {
                            VendorResponse.Id = smsSentList[i].Id;
                            VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                            VendorResponse.ContactId = smsSentList[i].ContactId;
                            VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                            VendorResponse.ResponseId = "";
                            VendorResponse.NotDeliverStatus = 0;
                            ErrorMessage = VendorResponse.ReasonForNotDelivery = "Message was trying to send before or after the time limit";
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
                            ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id) : ErrorMessage;
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
                            ErrorMessage = VendorResponse.ReasonForNotDelivery = String.IsNullOrEmpty(ErrorMessage) ? Convert.ToString(digiSpiceResponseResult.recipients.Where(x => x.to.Contains(smsSentList[i].PhoneNumber)).ToList()[0].message_id) : ErrorMessage;
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
                    ErrorMessage = VendorResponse.ReasonForNotDelivery = ex.Message.ToString();
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

        private bool SendDigiSpiceBulkSms(DigiSpiceRequest JArrayDataList)
        {
            bool responseStatus = false;
            try
            {
                using (var DoveSoftHttpClientRequest = new HttpRequestMessage(new HttpMethod("POST"), SmsConfiguration.ConfigurationUrl))
                {
                    DoveSoftHttpClientRequest.Content = new StringContent(JsonConvert.SerializeObject(JArrayDataList));
                    DoveSoftHttpClientRequest.Content.Headers.Add("apikey", SmsConfiguration.ApiKey);
                    DoveSoftHttpClientRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    using (HttpClient SmsPortalHttpClient = new HttpClient())
                    {
                        HttpResponseMessage DigiSpiceResponse = SmsPortalHttpClient.SendAsync(DoveSoftHttpClientRequest).Result;
                        string digispiceResponseContent = DigiSpiceResponse.Content.ReadAsStringAsync().Result;
                        dynamic DigiSpiceResponseObj = JsonConvert.DeserializeObject(digispiceResponseContent);

                        if (DigiSpiceResponse.StatusCode == HttpStatusCode.OK)
                        {
                            if (DigiSpiceResponseObj.status.Value.ToLower().Contains("success") && DigiSpiceResponseObj.recipients.Count > 0)
                            {
                                responseStatus = true;
                                List<DigiSpiceResponse> digiSpiceResponseList = new List<DigiSpiceResponse>();
                                foreach (var each in DigiSpiceResponseObj.recipients)
                                {
                                    dynamic data = JObject.Parse(each.ToString());
                                    DigiSpiceResponse digispiceResponse1 = new DigiSpiceResponse
                                    {
                                        to = data.to.ToString(),
                                        message_id = data.message_id.ToString()
                                    };

                                    digiSpiceResponseList.Add(digispiceResponse1);
                                }

                                digiSpiceResponseResult.timestamp = DigiSpiceResponseObj.timestamp;
                                digiSpiceResponseResult.status = DigiSpiceResponseObj.status;
                                digiSpiceResponseResult.request_id = DigiSpiceResponseObj.request_id;
                                digiSpiceResponseResult.recipients = digiSpiceResponseList;
                            }
                            else if (DigiSpiceResponseObj.status.Value.ToLower().Contains("failure") && DigiSpiceResponseObj.errors.Count > 0)
                            {
                                responseStatus = false;
                                List<DigiSpiceResponse> digiSpiceResponseList = new List<DigiSpiceResponse>();
                                foreach (var each in DigiSpiceResponseObj.errors)
                                {
                                    dynamic data = JObject.Parse(each.ToString());
                                    DigiSpiceResponse digispiceResponse1 = new DigiSpiceResponse
                                    {
                                        message_id = data.description.ToString()
                                    };

                                    digiSpiceResponseList.Add(digispiceResponse1);
                                }

                                digiSpiceResponseResult.timestamp = DigiSpiceResponseObj.timestamp;
                                digiSpiceResponseResult.status = DigiSpiceResponseObj.status;
                                digiSpiceResponseResult.request_id = DigiSpiceResponseObj.request_id;
                                digiSpiceResponseResult.recipients = digiSpiceResponseList;
                            }
                            else
                            {
                                responseStatus = false;
                                ErrorMessage = "StatusCode=" + DigiSpiceResponse.StatusCode + "ErrorMessage=" + Convert.ToString(DigiSpiceResponseObj);
                            }
                        }
                        else
                        {
                            responseStatus = false;
                            ErrorMessage = "StatusCode=" + DigiSpiceResponse.StatusCode + "ErrorMessage=" + Convert.ToString(DigiSpiceResponseObj);
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

    #region DigiSpiceRequest
    public class DigiSpiceRequest
    {
        public string sender_id { get; set; }
        public string type { get; set; }
        public string message { get; set; }
        public List<DigiSpiceMessage> recipient { get; set; }
        public string label { get; set; }
        public List<CountrySpecific> country_specific { get; set; }
    }

    public class DigiSpiceMessage
    {
        public string[] to { get; set; }
        public Messages variables { get; set; }
    }

    public class Messages
    {
        public string MESSAGE { get; set; }
    }

    public class CountrySpecific
    {
        public string country { get; set; }
        public string template_id { get; set; }
        public string entity_id { get; set; }
    }

    #endregion

    #region DigiSpiceResponse
    public class DigiSpiceResult
    {
        public string timestamp { get; set; }
        public string status { get; set; }
        public string request_id { get; set; }
        public List<DigiSpiceResponse> recipients { get; set; }
    }
    public class DigiSpiceResponse
    {
        public string to { get; set; }
        public string message_id { get; set; }
    }
    #endregion
}