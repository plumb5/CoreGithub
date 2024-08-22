using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;
using Plumb5GenralFunction;
using System.Text;

namespace Plumb5.Controllers
{
    public class SendSMSToContactController :BaseController
    {
        public SendSMSToContactController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /SendSMSToContact/

        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetContactDetails([FromBody] SendSMSToContact_GetContactDetailsDto SendSMSToContactDto)
        {
            Contact contact = null;
            using (var objDL =   DLContact.GetContactDetails(SendSMSToContactDto.accountId, SQLProvider))
                contact = await objDL.GetContactDetails(new Contact() { ContactId = SendSMSToContactDto.ContactId });

            if (contact != null)
                contact.PhoneNumber = !String.IsNullOrEmpty(contact.PhoneNumber) ? Helper.MaskPhoneNumber(contact.PhoneNumber) : contact.PhoneNumber;

            return Json(contact );
        }

        public async Task<JsonResult> ScheduleOrSendSms([FromBody] SendSMSToContact_ScheduleOrSendSmsDto SendSMSToContactDto)
        {
            bool Result = false;
            string Message = "";
            string MessageContent = "";
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            string VendorTemplateId = "0";
            Contact contactDetails = new Contact() { ContactId = SendSMSToContactDto.SmsContact.ContactId };

            if (SendSMSToContactDto.TemplateId > 0)
            {
                UserInfo userDetails = new UserInfo();
                using (var obj =   DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    userDetails =await  obj.GetDetail(user.UserId);
                }

                SmsTemplate smsTemplate;
                using (var objDL =   DLSmsTemplate.GetDLSmsTemplate(SendSMSToContactDto.accountId, SQLProvider))
                {
                    smsTemplate = await objDL.GetDetails(SendSMSToContactDto.TemplateId);
                }

                MessageContent = System.Web.HttpUtility.HtmlDecode(smsTemplate.MessageContent);
                VendorTemplateId = smsTemplate.VendorTemplateId;
                string P5UniqueID = Guid.NewGuid().ToString();
                HelperForSMS HelpSMS = new HelperForSMS(SendSMSToContactDto.accountId, SQLProvider);
                List<SmsTemplateUrl> smsUrlList;
                using (var objsmstempUrl =   DLSmsTemplateUrl.GetDLSmsTemplateUrl(SendSMSToContactDto.accountId, SQLProvider))
                {
                    smsUrlList =  (await objsmstempUrl.GetDetail(SendSMSToContactDto.TemplateId)).ToList();
                }

                using (var objDL =   DLContact.GetContactDetails(SendSMSToContactDto.accountId, SQLProvider))
                {
                    contactDetails = await objDL.GetDetails(contactDetails, null, true);
                }

                if (contactDetails == null)
                {
                    contactDetails = new Contact() { PhoneNumber = SendSMSToContactDto.ReminderDetails.PhoneNumber };
                }
                else
                {
                    SendSMSToContactDto.ReminderDetails.PhoneNumber = contactDetails.PhoneNumber;
                    SendSMSToContactDto.ReminderDetails.ContactId = contactDetails.ContactId;
                }


                StringBuilder Bodydata = new StringBuilder();
                Bodydata.Append(MessageContent);
                HelpSMS.ReplaceMessageWithSMSUrl(SendSMSToContactDto.CampaignJobName, Bodydata, 0, contactDetails.ContactId, smsUrlList, P5UniqueID);
                //HelpSMS.ReplaceContactDetails(Bodydata, contactDetails);
                HelpSMS.ReplaceContactDetails(Bodydata, contactDetails, SendSMSToContactDto.accountId, "", SendSMSToContactDto.TemplateId, 0, P5UniqueID, "sms", smsTemplate.ConvertLinkToShortenUrl);
                HelpSMS.ReplaceCounselorDetails(Bodydata, userDetails);

                //replace the lms custom field data
                if (SendSMSToContactDto.lmsgroupmemberid > 0 && (Bodydata.ToString().Contains("[{*")) && (Bodydata.ToString().Contains("*}]")))
                    Bodydata.LmsUserInfoFieldsReplacement(SendSMSToContactDto.accountId, SendSMSToContactDto.lmsgroupmemberid, contactDetails.ContactId,SQLProvider);

                MessageContent = Bodydata.ToString();
                SendSMSToContactDto.ReminderDetails.TemplateContent = MessageContent;
            }

            if (SendSMSToContactDto.SendType == 1)
            {
                SendSMSToContactDto.ReminderDetails.UserInfoUserId = user.UserId;
                SendSMSToContactDto.ReminderDetails.LmsGroupMemberId = SendSMSToContactDto.lmsgroupmemberid;
                SendSMSToContactDto.ReminderDetails.Score = SendSMSToContactDto.Score;
                SendSMSToContactDto.ReminderDetails.LeadLabel = SendSMSToContactDto.LeadLabel;
                SendSMSToContactDto.ReminderDetails.Publisher = SendSMSToContactDto.Publisher;
                ContactMailSMSReminderDetails ReminderDetails = new ContactMailSMSReminderDetails();
                Helper.CopyWithDateTimeWhenString(SendSMSToContactDto.ReminderDetails, ReminderDetails);
                if (SendSMSToContactDto.ReminderDetails.Id == 0)
                {
                    if (String.IsNullOrEmpty(SendSMSToContactDto.ReminderDetails.Name))
                    {
                        SendSMSToContactDto.ReminderDetails.Name = contactDetails.Name;
                    }

                    using (var objDL =   DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendSMSToContactDto.accountId,SQLProvider))
                    {
                        SendSMSToContactDto.ReminderDetails.Id =await objDL.SaveScheduledAlerts(ReminderDetails);
                    }

                    if (SendSMSToContactDto.ReminderDetails.Id > 0)
                    {
                        Result = true;
                        //Message = "SMS scheduled successfully";
                    }
                    else
                    {
                        Result = false;
                        // Message = "SMS not scheduled. Please try later.";
                    }
                }
                else
                {
                    using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendSMSToContactDto.accountId, SQLProvider))
                    {
                        Result = await objDL.UpdateScheduledSmsAlerts(ReminderDetails);
                    }
                    //if (Result)
                    //    Message = "Sms schedule alert updated successfully";
                    //else
                    //    Message = "Sms schedule alert not updated.";

                }
            }
            else
            {
                bool IsUnicodeMessage = Helper.ContainsUnicodeCharacter(MessageContent);
                SmsConfiguration smsConfiguration = new SmsConfiguration();

                if (SendSMSToContactDto.ReminderDetails.IsPromotionalOrTransnational)
                {
                    using (var objDLSMSConfig =   DLSmsConfiguration.GetDLSmsConfiguration(SendSMSToContactDto.accountId,SQLProvider))
                    {
                        smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                    }
                }
                else
                {
                    using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(SendSMSToContactDto.accountId, SQLProvider))
                    {
                        smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);
                    }
                }

                if (smsConfiguration != null && smsConfiguration.Id > 0)
                {
                    if (!smsConfiguration.IsPromotionalOrTransactionalType && smsConfiguration.ProviderName.ToLower() == "everlytic")
                    {
                        Result = false;
                        Message = "You cannot send sms for everlytic promotional";
                    }
                    else if (smsConfiguration.IsBulkSupported.HasValue && smsConfiguration.IsBulkSupported.Value)
                    {
                        SmsSent smsSent = new SmsSent()
                        {
                            CampaignJobName = SendSMSToContactDto.CampaignJobName,
                            ContactId = contactDetails.ContactId,
                            GroupId = 0,
                            MessageContent = SendSMSToContactDto.ReminderDetails.TemplateContent,
                            PhoneNumber = SendSMSToContactDto.ReminderDetails.PhoneNumber,
                            SmsSendingSettingId = 0,
                            SmsTemplateId = SendSMSToContactDto.TemplateId,
                            VendorName = smsConfiguration.ProviderName,
                            IsUnicodeMessage = IsUnicodeMessage,
                            VendorTemplateId = VendorTemplateId,
                            UserInfoUserId = user.UserId,
                            Score = SendSMSToContactDto.Score,
                            LeadLabel = SendSMSToContactDto.LeadLabel,
                            Publisher = SendSMSToContactDto.Publisher,
                            LmsGroupMemberId = SendSMSToContactDto.lmsgroupmemberid,
                        };

                        IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(SendSMSToContactDto.accountId, smsConfiguration, SendSMSToContactDto.CampaignJobName,SQLProvider);
                        bool SentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);

                        if (SmsGeneralBaseFactory.VendorResponses != null && SmsGeneralBaseFactory.VendorResponses.Count > 0)
                        {
                            string ErrorMessage = SmsGeneralBaseFactory.ErrorMessage;
                            if (SentStatus)
                            {
                                Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                smsSent.SentDate = DateTime.Now;
                                smsSent.IsDelivered = 0;
                                smsSent.IsClicked = 0;
                                smsSent.Operator = null;
                                smsSent.Circle = null;
                                smsSent.DeliveryTime = null;
                                smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;

                                using (var objDL =   DLSmsSent.GetDLSmsSent(SendSMSToContactDto.accountId,SQLProvider))
                                {
                                    await objDL.Save(smsSent);
                                }

                                Result = true;
                                Message = "SMS has been sent.";
                            }
                            else
                            {
                                Result = false;
                                Message = ErrorMessage;
                            }
                        }
                        else
                        {
                            Result = false;
                            Message = "Unable to send a sms";
                        }
                    }
                }
                else
                {
                    Result = false;
                    Message = "SMS Configuration not found.";
                }
            }

            return Json(new { Result, Message } );
        }
    }
}
