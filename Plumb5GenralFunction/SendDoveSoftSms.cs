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
    public class SendDoveSoftSms : IDisposable, IBulkSmsSending
    {
        #region Declaration
        readonly SmsConfiguration SmsConfiguration;
        public DoveSoftResult doveSoftResponseResult;
        public string ErrorMessage { get; set; }
        private readonly string JobTagName;
        public List<MLSmsVendorResponse> VendorResponses { get; set; }
        #endregion Declaration

        public SendDoveSoftSms(SmsConfiguration currentSmsConfiguration, string jobTagName = "campaign")
        {
            SmsConfiguration = currentSmsConfiguration;
            JobTagName = jobTagName;
            doveSoftResponseResult = new DoveSoftResult();
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

                    JObject EachJObject = new JObject();
                    EachJObject["sms"] = smsSent.MessageContent;
                    EachJObject["mobiles"] = smsSent.PhoneNumber;
                    EachJObject["senderid"] = SmsConfiguration.Sender;
                    EachJObject["clientSMSID"] = smsSent.ContactId.ToString();
                    EachJObject["accountusagetypeid"] = SmsConfiguration.IsPromotionalOrTransactionalType ? "1" : "2";
                    EachJObject["entityid"] = SmsConfiguration.EntityId;
                    EachJObject["tempid"] = smsSent.VendorTemplateId;

                    bool IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSent.MessageContent);
                    if (IsUnicodeMessage)
                        EachJObject["unicode"] = 1;

                    JArrayDataList.Add(EachJObject);

                    result = SendDoveSoftBulkSms(JArrayDataList);
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
                if (result && doveSoftResponseResult != null && doveSoftResponseResult.smslist != null && doveSoftResponseResult.smslist.sms != null && doveSoftResponseResult.smslist.sms.Count > 0)
                {
                    if (doveSoftResponseResult.smslist.sms.Count > 1)
                    {
                        if (doveSoftResponseResult.smslist.sms[0].status == "success")
                        {
                            VendorResponse.Id = smsSent.Id;
                            VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                            VendorResponse.ContactId = smsSent.ContactId;
                            VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
                            VendorResponse.NotDeliverStatus = 0;
                            VendorResponse.ReasonForNotDelivery = doveSoftResponseResult.smslist.sms[0].reason;
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
                            VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
                        }
                        else
                        {
                            ErrorMessage = doveSoftResponseResult.smslist.sms[0].code + "-" + doveSoftResponseResult.smslist.sms[0].reason;
                            VendorResponse.Id = smsSent.Id;
                            VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                            VendorResponse.ContactId = smsSent.ContactId;
                            VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
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
                            VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
                        }
                    }
                    else
                    {
                        if (doveSoftResponseResult.smslist.sms[0].status == "success")
                        {
                            VendorResponse.Id = smsSent.Id;
                            VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                            VendorResponse.ContactId = smsSent.ContactId;
                            VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
                            VendorResponse.NotDeliverStatus = 0;
                            VendorResponse.ReasonForNotDelivery = doveSoftResponseResult.smslist.sms[0].reason;
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
                            VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
                        }
                        else
                        {
                            ErrorMessage = doveSoftResponseResult.smslist.sms[0].code + "-" + doveSoftResponseResult.smslist.sms[0].reason;
                            VendorResponse.Id = smsSent.Id;
                            VendorResponse.SmsSendingSettingId = smsSent.SmsSendingSettingId;
                            VendorResponse.TriggerMailSMSId = smsSent.TriggerMailSMSId;
                            VendorResponse.ContactId = smsSent.ContactId;
                            VendorResponse.PhoneNumber = smsSent.PhoneNumber;
                            VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
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
                            VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
                        }
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
                    VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
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
                    VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
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
                    VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
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
                VendorResponse.MessageParts = Helper.GetTotalMessageParts(smsSent.MessageContent);
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
                        EachJObject["sms"] = smsSentList[i].MessageContent;
                        EachJObject["mobiles"] = smsSentList[i].PhoneNumber;
                        EachJObject["senderid"] = SmsConfiguration.Sender;
                        EachJObject["clientSMSID"] = smsSentList[i].ContactId.ToString();
                        EachJObject["accountusagetypeid"] = SmsConfiguration.IsPromotionalOrTransactionalType ? "1" : "2";
                        EachJObject["entityid"] = SmsConfiguration.EntityId;
                        EachJObject["tempid"] = smsSentList[i].VendorTemplateId;

                        bool IsUnicodeMessage = Helper.ContainsUnicodeCharacter(smsSentList[i].MessageContent);
                        if (IsUnicodeMessage)
                            EachJObject["unicode"] = 1;

                        JArrayDataList.Add(EachJObject);
                    }

                    result = SendDoveSoftBulkSms(JArrayDataList);
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
                    if (result && doveSoftResponseResult != null && doveSoftResponseResult.smslist != null && doveSoftResponseResult.smslist.sms != null && doveSoftResponseResult.smslist.sms.Count > 0)
                    {
                        if (doveSoftResponseResult.smslist.sms.Count > 1)
                        {
                            DoveSoftResponse vendorResponse = doveSoftResponseResult.smslist.sms.Where(x => x.mobileno.Contains(smsSentList[i].PhoneNumber)).ToList()[0];

                            if (doveSoftResponseResult.smslist.sms[i].status == "success")
                            {
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(vendorResponse.messageid);
                                VendorResponse.NotDeliverStatus = 0;
                                VendorResponse.ReasonForNotDelivery = vendorResponse.reason;
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
                            else
                            {
                                ErrorMessage = vendorResponse.code + "-" + vendorResponse.reason;
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(vendorResponse.messageid);
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
                        else
                        {
                            if (doveSoftResponseResult.smslist.sms[0].status == "success")
                            {
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
                                VendorResponse.NotDeliverStatus = 0;
                                VendorResponse.ReasonForNotDelivery = doveSoftResponseResult.smslist.sms[0].reason;
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
                            else
                            {
                                ErrorMessage = doveSoftResponseResult.smslist.sms[0].code + "-" + doveSoftResponseResult.smslist.sms[0].reason;
                                VendorResponse.Id = smsSentList[i].Id;
                                VendorResponse.SmsSendingSettingId = smsSentList[i].SmsSendingSettingId;
                                VendorResponse.TriggerMailSMSId = smsSentList[i].TriggerMailSMSId;
                                VendorResponse.ContactId = smsSentList[i].ContactId;
                                VendorResponse.PhoneNumber = smsSentList[i].PhoneNumber;
                                VendorResponse.ResponseId = Convert.ToString(doveSoftResponseResult.smslist.sms[0].messageid);
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

        private bool SendDoveSoftBulkSms(JArray JArrayDataList)
        {
            bool responseStatus = false;
            try
            {

                JObject SendingJObject = new JObject();
                SendingJObject["listsms"] = JArrayDataList;
                SendingJObject["password"] = SmsConfiguration.Password;
                SendingJObject["user"] = SmsConfiguration.UserName;

                using (var DoveSoftHttpClientRequest = new HttpRequestMessage(new HttpMethod("POST"), SmsConfiguration.ConfigurationUrl))
                {
                    DoveSoftHttpClientRequest.Content = new StringContent(JsonConvert.SerializeObject(SendingJObject));
                    DoveSoftHttpClientRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    using (HttpClient SmsPortalHttpClient = new HttpClient())
                    {
                        HttpResponseMessage DoveSoftResponse = SmsPortalHttpClient.SendAsync(DoveSoftHttpClientRequest).Result;
                        string DoveSoftResponseContent = DoveSoftResponse.Content.ReadAsStringAsync().Result;
                        dynamic DoveSoftResponseObj = JsonConvert.DeserializeObject(DoveSoftResponseContent);

                        if (DoveSoftResponse.StatusCode == HttpStatusCode.OK)
                        {
                            responseStatus = true;
                            if (DoveSoftResponseObj.smslist.sms.Count > 0)
                            {
                                List<DoveSoftResponse> doveSoftResponseList = new List<DoveSoftResponse>();
                                foreach (var each in DoveSoftResponseObj.smslist.sms)
                                {
                                    dynamic data = JObject.Parse(each.ToString());
                                    DoveSoftResponse doveSoftResponse1 = new DoveSoftResponse
                                    {
                                        reason = data.reason.ToString(),
                                        status = data.status.ToString(),
                                        messageid = String.IsNullOrEmpty(data.messageid.ToString()) ? 0 : Convert.ToInt64(data.messageid),
                                        clientsmsid = String.IsNullOrEmpty(data.clientsmsid.ToString()) ? 0 : Convert.ToInt64(data.clientsmsid),
                                        code = data.code.ToString(),
                                        mobileno = data.mobileno.ToString()
                                    };

                                    doveSoftResponseList.Add(doveSoftResponse1);
                                }

                                DoveSoftResponseBody doveSoftResponseBody = new DoveSoftResponseBody() { sms = doveSoftResponseList };
                                DoveSoftResult doveSoftResult = new DoveSoftResult() { smslist = doveSoftResponseBody };
                                doveSoftResponseResult = doveSoftResult;

                                //doveSoftResponseResult = JsonConvert.DeserializeObject<DoveSoftResult>(DoveSoftResponseContent);
                            }
                            else
                            {
                                if (DoveSoftResponseContent.ToString().ToLower().Contains("insufficientbalance"))
                                {
                                    DoveSoftResponse errorMessage = new DoveSoftResponse()
                                    {
                                        reason = "Insufficient Balance",
                                        status = "error",
                                        messageid = 0,
                                        clientsmsid = 0,
                                        code = "1004",
                                        mobileno = "0"
                                    };

                                    DoveSoftResponseBodySingle doveSoftResponseBodySingle = new DoveSoftResponseBodySingle();
                                    doveSoftResponseBodySingle.sms = errorMessage;

                                    doveSoftResponseResult.smslist = new DoveSoftResponseBody() { sms = new List<DoveSoftResponse>() };
                                    doveSoftResponseResult.smslist.sms.Add(doveSoftResponseBodySingle.sms);
                                    ErrorMessage = "StatusCode=" + DoveSoftResponse.StatusCode + "ErrorMessage=" + errorMessage.reason;
                                    responseStatus = false;
                                }
                                else if (DoveSoftResponseContent.ToString().ToLower().Contains("invaliduseridpassword"))
                                {
                                    DoveSoftResponse errorMessage = new DoveSoftResponse()
                                    {
                                        reason = "Invalid Userid Password",
                                        status = "error",
                                        messageid = 0,
                                        clientsmsid = 0,
                                        code = "1001",
                                        mobileno = "0"
                                    };

                                    DoveSoftResponseBodySingle doveSoftResponseBodySingle = new DoveSoftResponseBodySingle();
                                    doveSoftResponseBodySingle.sms = errorMessage;

                                    doveSoftResponseResult.smslist = new DoveSoftResponseBody() { sms = new List<DoveSoftResponse>() };
                                    doveSoftResponseResult.smslist.sms.Add(doveSoftResponseBodySingle.sms);
                                    ErrorMessage = "StatusCode=" + DoveSoftResponse.StatusCode + "ErrorMessage=" + errorMessage.reason;
                                    responseStatus = false;
                                }
                                else if (DoveSoftResponseContent.ToString().ToLower().Contains("accountvalidityexpired"))
                                {
                                    DoveSoftResponse errorMessage = new DoveSoftResponse()
                                    {
                                        reason = "Account validity expired",
                                        status = "error",
                                        messageid = 0,
                                        clientsmsid = 0,
                                        code = "1033",
                                        mobileno = "0"
                                    };

                                    DoveSoftResponseBodySingle doveSoftResponseBodySingle = new DoveSoftResponseBodySingle();
                                    doveSoftResponseBodySingle.sms = errorMessage;

                                    doveSoftResponseResult.smslist = new DoveSoftResponseBody() { sms = new List<DoveSoftResponse>() };
                                    doveSoftResponseResult.smslist.sms.Add(doveSoftResponseBodySingle.sms);
                                    ErrorMessage = "StatusCode=" + DoveSoftResponse.StatusCode + "ErrorMessage=" + errorMessage.reason;
                                    responseStatus = false;
                                }
                                else if (DoveSoftResponseContent.ToString().ToLower().Contains("insufficientdltbalance"))
                                {

                                    DoveSoftResponse errorMessage = new DoveSoftResponse()
                                    {
                                        reason = "Insufficient DLT Balance",
                                        status = "error",
                                        messageid = 0,
                                        clientsmsid = 0,
                                        code = "1035",
                                        mobileno = "0"
                                    };

                                    DoveSoftResponseBodySingle doveSoftResponseBodySingle = new DoveSoftResponseBodySingle();
                                    doveSoftResponseBodySingle.sms = errorMessage;

                                    doveSoftResponseResult.smslist = new DoveSoftResponseBody() { sms = new List<DoveSoftResponse>() };
                                    doveSoftResponseResult.smslist.sms.Add(doveSoftResponseBodySingle.sms);
                                    ErrorMessage = "StatusCode=" + DoveSoftResponse.StatusCode + "ErrorMessage=" + errorMessage.reason;
                                    responseStatus = false;
                                }
                                else
                                {
                                    DoveSoftResultSingle doveSoftResultSingle = JsonConvert.DeserializeObject<DoveSoftResultSingle>(DoveSoftResponseContent);

                                    //List<DoveSoftResponse> doveSoftResponse = new List<DoveSoftResponse>();
                                    //DoveSoftResponseBody doveSoftResponseBody = new DoveSoftResponseBody();
                                    //doveSoftResponseBody.sms = doveSoftResponse;
                                    doveSoftResponseResult.smslist = new DoveSoftResponseBody() { sms = new List<DoveSoftResponse>() };
                                    doveSoftResponseResult.smslist.sms.Add(doveSoftResultSingle.smslist.sms);
                                }
                            }
                        }
                        else
                        {
                            responseStatus = false;
                            ErrorMessage = "StatusCode=" + DoveSoftResponse.StatusCode + "ErrorMessage=" + Convert.ToString(DoveSoftResponseContent);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                responseStatus = false;
                ErrorMessage = ex.Message.ToString();


                using (ErrorUpdation objError = new ErrorUpdation("P5DoveSoftVendorErrorLog"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Error Log", ex.ToString());

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

    #region DoveSoftResponses
    public class DoveSoftResult
    {
        public DoveSoftResponseBody smslist { get; set; }
    }

    public class DoveSoftResponseBody
    {
        public List<DoveSoftResponse> sms { get; set; }
    }

    public class DoveSoftResultSingle
    {
        public DoveSoftResponseBodySingle smslist { get; set; }
    }

    public class DoveSoftResponseBodySingle
    {
        public DoveSoftResponse sms { get; set; }
    }

    public class DoveSoftResponse
    {
        public string reason { get; set; }

        public string status { get; set; }

        public Int64 messageid { get; set; }

        public Int64 clientsmsid { get; set; }

        public string code { get; set; }

        public string mobileno { get; set; }
    }

    #endregion DoveSoftResponses
}
