using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;
using Plumb5GenralFunction;
using System.Globalization;
using System.Text;

namespace Plumb5.Controllers
{
    public class SendMailToContactController : BaseController
    {
        public SendMailToContactController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /SendMailToContact/

        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetContactDetails([FromBody] SendMailToContact_GetContactDetailsDto SendMailToContactDto)
        {
            Contact contact = null;
            using (var objDL = DLContact.GetContactDetails(SendMailToContactDto.accountId, SQLProvider))
                contact = await objDL.GetContactDetails(new Contact() { ContactId = SendMailToContactDto.ContactId });

            if (contact != null)
                contact.EmailId = !String.IsNullOrEmpty(contact.EmailId) ? Helper.MaskEmailAddress(contact.EmailId) : contact.EmailId;

            return Json(contact);
        }

        public async Task<JsonResult> ScheduleOrSendMail([FromBody] SendMailToContact_ScheduleOrSendMailDto SendMailToContactDto)
        {
            bool Result = false;
            string Message = "";
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            StringBuilder Body = new StringBuilder();
            HelperForMail HelpMail = new HelperForMail(SendMailToContactDto.accountId, "", "");
            MailTemplate templateDetails = new MailTemplate { Id = SendMailToContactDto.TemplateId };
            Contact contactDetails = new Contact() { ContactId = SendMailToContactDto.ReminderDetails.ContactId };

            using (var objDL = DLMailTemplate.GetDLMailTemplate(SendMailToContactDto.accountId, SQLProvider))
            {
                templateDetails = objDL.GETDetails(templateDetails);
            }

            string MailContent = await GetMailTemplateString(SendMailToContactDto.accountId, templateDetails);
            Body.Clear().Append(MailContent);
            HelpMail.ChangeImageToOnlineUrl(Body, templateDetails);

            using (var objDL = DLContact.GetContactDetails(SendMailToContactDto.accountId, SQLProvider))
                contactDetails = await objDL.GetDetails(contactDetails, null);


            if (contactDetails == null)
            {
                contactDetails = new Contact() { EmailId = SendMailToContactDto.ReminderDetails.EmailId };
                HelpMail.ReplaceContactDetails(Body, SendMailToContactDto.MailContact);
            }
            else
            {
                SendMailToContactDto.ReminderDetails.EmailId = contactDetails.EmailId;
                SendMailToContactDto.ReminderDetails.ContactId = contactDetails.ContactId;
                HelpMail.ReplaceContactDetails(Body, contactDetails);
            }

            //replace the lms custom field data
            if (SendMailToContactDto.lmsgroupmemberid > 0 && (Body.ToString().Contains("[{*")) && (Body.ToString().Contains("*}]")))
                Body = await Body.LmsUserInfoFieldsReplacement(SendMailToContactDto.accountId, SendMailToContactDto.lmsgroupmemberid, contactDetails.ContactId, SQLProvider);

            //if ((Body.ToString().Contains("[{*")) && (Body.ToString().Contains("*}]")))
            //{
            //    Message = "Mail Template dynamic content not replaced";
            //    Result = false;
            //}
            //else
            {
                if (SendMailToContactDto.SendType == 1)
                {
                    SendMailToContactDto.ReminderDetails.TemplateContent = Helper.Base64Encode(Body.ToString());
                    SendMailToContactDto.ReminderDetails.UserInfoUserId = user.UserId;
                    SendMailToContactDto.ReminderDetails.LmsGroupMemberId = SendMailToContactDto.lmsgroupmemberid;
                    SendMailToContactDto.ReminderDetails.Score = SendMailToContactDto.Score;
                    SendMailToContactDto.ReminderDetails.LeadLabel = SendMailToContactDto.LeadLabel;
                    SendMailToContactDto.ReminderDetails.Publisher = SendMailToContactDto.Publisher;
                    ContactMailSMSReminderDetails ReminderDetails = new ContactMailSMSReminderDetails();
                    Helper.CopyWithDateTimeWhenString(SendMailToContactDto.ReminderDetails, ReminderDetails);

                    if (SendMailToContactDto.ReminderDetails.Id == 0)
                    {
                        if (String.IsNullOrEmpty(SendMailToContactDto.ReminderDetails.Name))
                        {
                            SendMailToContactDto.ReminderDetails.Name = contactDetails.Name;
                        }

                        using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendMailToContactDto.accountId, SQLProvider))
                        {
                            SendMailToContactDto.ReminderDetails.Id = await objDL.SaveScheduledAlerts(ReminderDetails);
                        }

                        if (SendMailToContactDto.ReminderDetails.Id > 0)
                        {
                            Result = true;
                            //Message = "Mail scheduled successfully";
                        }
                        else
                        {
                            Result = false;
                            // Message = "Mail not scheduled. Please try later.";
                        }
                    }
                    else
                    {
                        using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendMailToContactDto.accountId, SQLProvider))
                        {
                            Result = await objDL.UpdateScheduledMailAlerts(ReminderDetails);
                        }
                    }

                }
                else
                {
                    MailConfiguration configration = new MailConfiguration();

                    if (SendMailToContactDto.ReminderDetails.IsPromotionalOrTransnational)
                    {
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(SendMailToContactDto.accountId, SQLProvider))
                        {
                            configration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                        }
                    }
                    else
                    {
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(SendMailToContactDto.accountId, SQLProvider))
                        {
                            configration = await objDLConfig.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);
                        }
                    }
                    if (configration != null && configration.Id > 0)
                    {
                        if (!configration.IsPromotionalOrTransactionalType && configration.ProviderName.ToLower() == "everlytic")
                        {
                            Result = false;
                            Message = "You cannot send mail for everlytic promotional";
                        }
                        else if (configration.IsBulkSupported.HasValue && configration.IsBulkSupported.Value)
                        {
                            MailSetting mailSetting = new MailSetting()
                            {
                                FromEmailId = SendMailToContactDto.ReminderDetails.FromEmailId,
                                FromName = SendMailToContactDto.ReminderDetails.FromName,
                                MailTemplateId = SendMailToContactDto.ReminderDetails.TemplateId,
                                ReplyTo = SendMailToContactDto.ReminderDetails.MailReplyEmailId,
                                Subject = SendMailToContactDto.ReminderDetails.Subject,
                                Subscribe = true,
                                IsSchedule = false,
                                IsTransaction = SendMailToContactDto.ReminderDetails.IsPromotionalOrTransnational,
                                Forward = false,
                                MessageBodyText = Body.ToString()
                            };

                            MLMailSent mailSent = new MLMailSent()
                            {
                                CampaignJobName = "",
                                ContactId = contactDetails.ContactId,
                                EmailId = contactDetails.EmailId,
                                GroupId = 0,
                                ResponseId = Guid.NewGuid().ToString(),
                                P5MailUniqueID = Guid.NewGuid().ToString(),
                                WorkFlowId = 0,
                                WorkFlowDataId = 0,
                                Score = SendMailToContactDto.Score,
                                LeadLabel = SendMailToContactDto.LeadLabel,
                                Publisher = SendMailToContactDto.Publisher,
                                LmsGroupMemberId = SendMailToContactDto.lmsgroupmemberid,
                            };

                            MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                            {
                                ConfigurationId = 0,
                                GroupId = 0,
                            };

                            List<MLMailSent> mailSentList = new List<MLMailSent>();
                            mailSentList.Add(mailSent);

                            IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(SendMailToContactDto.accountId, mailSetting, mailSentSavingDetials, configration, "MailTrack", "LMS", SendMailToContactDto.lmsgroupmemberid, SQLProvider);
                            bool result = MailGeneralBaseFactory.SendBulkMail(mailSentList);

                            if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                            {
                                SaveBulkMail(SendMailToContactDto.accountId, mailSetting, mailSent, MailGeneralBaseFactory.VendorResponses, configration);
                                Result = true;
                                Message = "Mail has been sent.";
                            }
                            else
                            {
                                Result = false;
                                Message = "Unable to send a mail";
                            }
                        }
                        else
                        {
                            Result = false;
                            Message = "Unable to send a mail";
                        }
                    }
                    else
                    {
                        Result = false;
                        Message = "Mail Configuration not found.";
                    }

                }
            }

            return Json(new { Result, Message });
        }

        private async Task<string> GetMailTemplateString(int accountId, MailTemplate templateDetails)
        {
            try
            {
                MailTemplateFile mailTemplateFile;
                using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(accountId, SQLProvider))
                {
                    mailTemplateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
                }
                SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, templateDetails.Id);
                return await awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload._bucketName);
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        private void SaveBulkMail(int adsId, MailSetting mailSetting, MLMailSent mailSent, List<MLMailVendorResponse> mailSentList, MailConfiguration configration)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            try
            {
                MailSent getmailSent = new MailSent()
                {
                    FromEmailId = mailSetting.FromEmailId,
                    FromName = mailSetting.FromName,
                    MailTemplateId = mailSetting.MailTemplateId,
                    Subject = mailSetting.Subject,
                    MailCampaignId = 0,
                    MailSendingSettingId = 0,
                    GroupId = 0,
                    ContactId = mailSent.ContactId,
                    EmailId = mailSent.EmailId,
                    P5MailUniqueID = mailSentList[0].P5MailUniqueID,
                    CampaignJobName = mailSentList[0].CampaignJobName,
                    ErrorMessage = mailSentList[0].ErrorMessage,
                    ProductIds = mailSentList[0].ProductIds,
                    ResponseId = mailSentList[0].ResponseId,
                    SendStatus = (byte)mailSentList[0].SendStatus,
                    WorkFlowDataId = mailSentList[0].WorkFlowDataId,
                    WorkFlowId = mailSentList[0].WorkFlowId,
                    SentDate = DateTime.Now,
                    MailConfigurationNameId = configration.MailConfigurationNameId,
                    UserInfoUserId = user.UserId,
                    Score = mailSent.Score,
                    LeadLabel = mailSent.LeadLabel,
                    Publisher = mailSent.Publisher,
                    LmsGroupMemberId = mailSent.LmsGroupMemberId
                };

                using (var objDLMailSent = DLMailSent.GetDLMailSent(adsId, SQLProvider))
                {
                    objDLMailSent.Send(getmailSent);
                }

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailToContactController"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendMailToContactController->Exception", ex.ToString());
                }
            }
        }
    }
}

