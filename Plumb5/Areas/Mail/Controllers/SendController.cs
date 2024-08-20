using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class SendController : BaseController
    {
        public SendController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<IActionResult> Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;

            int getSpamCheck = 0;
            MailSpamScoreVerifySetting settings = new MailSpamScoreVerifySetting();
            using (var objDLBLSpamScoreVerifySetting = DLMailSpamScoreVerifySetting.GetDLMailSpamScoreVerifySetting(account.AdsId, SQLProvider))
            {
                settings = await objDLBLSpamScoreVerifySetting.GetActiveprovider();
                if (settings != null)
                {
                    getSpamCheck = 1;
                }
            }

            ViewBag.IsSpamCheck = getSpamCheck;
            return View("SendMail");
        }

        [Log]
        public async Task<JsonResult> SendTestMail([FromBody] Send_SendTestMailDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs
            //long LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Send", "Mail", "SendTestMail", Helper.GetIP(), JsonConvert.SerializeObject(new { mailSendingSetting = mailSendingSetting, emailId = emailId, Areas = Areas }));
            //#endregion

            Task<bool> Status;
            MailConfiguration configration = new MailConfiguration();

            if (!details.mailSendingSetting.IsPromotionalOrTransactionalType)
            {
                using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(details.accountId, SQLProvider))
                {
                    configration = await objDLConfig.GetConfigurationDetailsForSending(false, MailConfigurationNameId: details.mailSendingSetting.MailConfigurationNameId);
                }
            }
            else
            {
                using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(details.accountId, SQLProvider))
                {
                    configration = await objDLConfig.GetConfigurationDetailsForSending(true, MailConfigurationNameId: details.mailSendingSetting.MailConfigurationNameId);
                }
            }

            if (configration != null && configration.Id > 0)
            {
                if (!configration.IsPromotionalOrTransactionalType && configration.ProviderName == "Everlytic")
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "Test mail cannot be sent for Everlytic promotional" }), "Unable to send a test mail");
                    return Json(new { Status = false, Message = "Test mail cannot be sent for Everlytic promotional" });
                }
                else if (configration.IsBulkSupported.HasValue && configration.IsBulkSupported.Value)
                {
                    Contact contact = new Contact() { EmailId = details.emailId };
                    using (var objDLContact = DLContact.GetContactDetails(details.accountId, SQLProvider))
                    {
                        contact = await objDLContact.GetDetails(contact);
                        if (contact == null)
                        {
                            contact = new Contact() { EmailId = details.emailId };
                            using (var objDL = DLContact.GetContactDetails(details.accountId, SQLProvider))
                            {
                                contact.ContactId = await objDL.Save(contact);
                            }
                        }
                    }

                    MailSetting mailSetting = new MailSetting()
                    {
                        Forward = details.mailSendingSetting.Forward,
                        FromEmailId = details.mailSendingSetting.FromEmailId,
                        FromName = details.mailSendingSetting.FromName,
                        MailTemplateId = details.mailSendingSetting.MailTemplateId,
                        ReplyTo = details.mailSendingSetting.ReplyTo,
                        Subject = details.mailSendingSetting.Subject,
                        Subscribe = details.mailSendingSetting.Subscribe,
                        //IsSchedule = mailSendingSetting.IsSchedule,
                        IsTransaction = details.mailSendingSetting.IsPromotionalOrTransactionalType
                    };

                    MLMailSent mailSent = new MLMailSent()
                    {
                        MailTemplateId = details.mailSendingSetting.MailTemplateId,
                        MailCampaignId = 0,
                        MailSendingSettingId = 0,
                        GroupId = 0,
                        ContactId = contact.ContactId,
                        EmailId = contact.EmailId,
                        P5MailUniqueID = Guid.NewGuid().ToString()

                    };

                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                    {
                        ConfigurationId = details.mailSendingSetting.Id,
                        GroupId = details.mailSendingSetting.GroupId
                    };

                    List<MLMailSent> mailSentList = new List<MLMailSent>();
                    mailSentList.Add(mailSent);

                    string CampaignName = string.Empty;
                    if (details.Areas == "Prospect")
                    {
                        CampaignName = "LMS";
                    }
                    else
                    {
                        CampaignName = "Mail";
                    }

                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(details.accountId, mailSetting, mailSentSavingDetials, configration, "MailTrack", CampaignName, SqlProvider: SQLProvider);
                    bool result = MailGeneralBaseFactory.SendBulkMail(mailSentList);

                    if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                    {
                        string ErrorMessage = MailGeneralBaseFactory.ErrorMessage;
                        List<MLMailVendorResponse> responses = MailGeneralBaseFactory.VendorResponses;
                        MailSent responseMailSent = new MailSent()
                        {
                            FromEmailId = mailSetting.FromEmailId,
                            FromName = mailSetting.FromName,
                            MailTemplateId = mailSetting.MailTemplateId,
                            Subject = mailSetting.Subject,
                            MailCampaignId = responses[0].MailCampaignId,
                            MailSendingSettingId = responses[0].MailSendingSettingId,
                            GroupId = responses[0].GroupId,
                            ContactId = responses[0].ContactId,
                            EmailId = responses[0].EmailId,
                            P5MailUniqueID = responses[0].P5MailUniqueID,
                            CampaignJobName = responses[0].CampaignJobName,
                            ErrorMessage = responses[0].ErrorMessage,
                            ProductIds = responses[0].ProductIds,
                            ResponseId = responses[0].ResponseId,
                            SendStatus = (byte)responses[0].SendStatus,
                            WorkFlowDataId = responses[0].WorkFlowDataId,
                            WorkFlowId = responses[0].WorkFlowId,
                            SentDate = DateTime.Now,
                            ReplayToEmailId = mailSetting.ReplyTo,
                            TriggerMailSmsId = 0,
                            MailConfigurationNameId = configration.MailConfigurationNameId,
                            UserInfoUserId = user.UserId
                        };

                        using (var objDL = DLMailSent.GetDLMailSent(details.accountId, SQLProvider))
                        {
                            await objDL.Send(responseMailSent);
                        }
                        if (result)
                        {
                            // Update MailSendingSetting TotalSent and TotalNotSent Count
                            var SentCount = 0; var FailureCount = 0;
                            if (responseMailSent.SendStatus == 1)
                            {
                                SentCount++;
                            }
                            else
                            {
                                FailureCount++;
                            }
                            UpdateMailSendingSettingStats(details.accountId, details.mailSendingSetting.Id, SentCount, FailureCount);

                            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, Message = "Test mail has been sent" }), "Test mail has been sent");
                            return Json(new { Status = true, Message = "Test mail has been sent" });
                        }
                        else
                        {
                            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = MailGeneralBaseFactory.VendorResponses[0].ErrorMessage }), "Unable to send a test mail");
                            return Json(new { Status = false, Message = MailGeneralBaseFactory.VendorResponses[0].ErrorMessage });
                        }
                    }
                    return Json(new { Status = false, Message = "Unable to send a test mail" });
                }
                else
                {
                    return Json(new { Status = false, Message = "Unable to send a test mail" });
                }

            }
            else
            {
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "Please check for the configuration setting" }), "Unable to send a test mail");
                return Json(new { Status = false, Message = "Please check for the configuration setting" });
            }
        }

        [Log]
        public async Task<JsonResult> SendGroupTestMail([FromBody] Send_SendGroupTestMailDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Send", "Mail", "SendGroupTestSMS", Helper.GetIP(), JsonConvert.SerializeObject(new { mailSendingSetting = mailSendingSetting }));
            //#endregion
            MailSendingSetting mailSendingSetting = new MailSendingSetting();
            Helper.CopyWithDateTimeWhenString(details.mailSendingSetting, mailSendingSetting);

            string Message = "";
            MailConfiguration configration = new MailConfiguration();
            int SentCount = 0;
            int FailureCount = 0;
            List<Tuple<string, string>> mailErrorContactList = new List<Tuple<string, string>>();
            List<string> mailSuccessContactList = new List<string>();
            try
            {
                if (mailSendingSetting != null && mailSendingSetting.GroupId > 0)
                {
                    if (mailSendingSetting.IsPromotionalOrTransactionalType)
                    {
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(details.accountId, SQLProvider))
                        {
                            configration = await objDLConfig.GetConfigurationDetailsForSending(true, MailConfigurationNameId: mailSendingSetting.MailConfigurationNameId);
                        }
                    }
                    else
                    {
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(details.accountId, SQLProvider))
                        {
                            configration = await objDLConfig.GetConfigurationDetailsForSending(false, MailConfigurationNameId: mailSendingSetting.MailConfigurationNameId);
                        }
                    }

                    if (configration != null && configration.Id > 0)
                    {
                        if (!configration.IsPromotionalOrTransactionalType && configration.ProviderName == "Everlytic")
                        {
                            Message = "Test mail cannot be sent for Everlytic promotional";
                            //LogMessage = "Unable to send test group mail as provider is Everlytic";
                        }
                        else
                        {
                            List<GroupMember> GroupMemberList;
                            using (var objDL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                            {
                                GroupMemberList = await objDL.GET(new GroupMember() { GroupId = mailSendingSetting.GroupId }, -1, -1, "");
                            }

                            if (GroupMemberList != null && GroupMemberList.Count > 0)
                            {
                                List<int> ContactIdList = GroupMemberList.Select(x => x.ContactId).Distinct().ToList();
                                if (ContactIdList != null && ContactIdList.Count > 0 && ContactIdList.Count <= 30)
                                {
                                    string SendingSettingName = ("Test_" + Helper.GenerateUniqueNumber() + "_" + mailSendingSetting.Name);

                                    mailSendingSetting.Name = SendingSettingName.Length > 50 ? SendingSettingName.Substring(0, 50) : SendingSettingName;
                                    mailSendingSetting.UserInfoUserId = user.UserId;
                                    mailSendingSetting.UserGroupId = user.UserGroupIdList.Count > 0 ? user.UserGroupIdList[0] : 0;
                                    mailSendingSetting.ScheduledStatus = 1;
                                    mailSendingSetting.ScheduledDate = DateTime.Now;
                                    mailSendingSetting.TotalContact = ContactIdList.Count;
                                    using (var objDL = DLMailSendingSetting.GetDLMailSendingSetting(details.accountId, SQLProvider))
                                    {
                                        mailSendingSetting.Id = await objDL.Save(mailSendingSetting);
                                    }
                                    if (mailSendingSetting.Id > 0)
                                    {
                                        List<Contact> contactList;
                                        using (var objDLcontact = DLContact.GetContactDetails(details.accountId, SQLProvider))
                                        {
                                            contactList = await objDLcontact.GetAllContactList(ContactIdList, false);
                                        }

                                        MailSetting mailSetting = new MailSetting();
                                        Helper.Copy(mailSendingSetting, mailSetting);

                                        MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                                        {
                                            ConfigurationId = mailSendingSetting.Id,
                                            GroupId = mailSendingSetting.GroupId
                                        };

                                        Contact contactDetails = null;
                                        if (configration.IsBulkSupported.HasValue && configration.IsBulkSupported.Value)
                                        {
                                            List<MLMailSent> mailSentList = new List<MLMailSent>();
                                            for (int i = 0; i < contactList.Count; i++)
                                            {
                                                contactDetails = contactList[i];
                                                if (contactDetails.Unsubscribe.HasValue && contactDetails.Unsubscribe.Value == 1)
                                                {
                                                    FailureCount++;
                                                    mailErrorContactList.Add(new Tuple<string, string>(Helper.MaskEmailAddress(contactDetails.EmailId), "Contact Is Unsubscribed"));
                                                }
                                                else
                                                {
                                                    MLMailSent mailSent = new MLMailSent()
                                                    {
                                                        MailTemplateId = mailSetting.MailTemplateId,
                                                        MailSendingSettingId = mailSendingSetting.Id,
                                                        GroupId = mailSendingSetting.GroupId,
                                                        ContactId = contactDetails.ContactId,
                                                        EmailId = contactDetails.EmailId,
                                                        DripSequence = 0,
                                                        DripConditionType = 0,
                                                        CampaignJobName = "campaign",
                                                        FromEmailId = mailSetting.FromEmailId,
                                                        FromName = mailSetting.FromName,
                                                        ReplayToEmailId = mailSetting.ReplyTo,
                                                        P5MailUniqueID = Guid.NewGuid().ToString()
                                                    };
                                                    mailSentList.Add(mailSent);
                                                }
                                            }

                                            IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(details.accountId, mailSetting, mailSentSavingDetials, configration, "MailTrack", "campaign", SqlProvider: SQLProvider);
                                            MailGeneralBaseFactory.SendBulkMail(mailSentList);
                                            string ErrorMessage = "";

                                            if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                                            {
                                                ErrorMessage = MailGeneralBaseFactory.ErrorMessage;

                                                for (int i = 0; i < MailGeneralBaseFactory.VendorResponses.Count; i++)
                                                {
                                                    MailSent getmailSent = new MailSent()
                                                    {
                                                        FromEmailId = mailSendingSetting.FromEmailId,
                                                        FromName = mailSendingSetting.FromName,
                                                        MailTemplateId = mailSendingSetting.MailTemplateId,
                                                        Subject = mailSendingSetting.Subject,
                                                        MailCampaignId = 0,
                                                        MailSendingSettingId = mailSendingSetting.Id,
                                                        GroupId = mailSendingSetting.GroupId,
                                                        ContactId = MailGeneralBaseFactory.VendorResponses[i].ContactId,
                                                        EmailId = MailGeneralBaseFactory.VendorResponses[i].EmailId,
                                                        P5MailUniqueID = MailGeneralBaseFactory.VendorResponses[i].P5MailUniqueID,
                                                        CampaignJobName = MailGeneralBaseFactory.VendorResponses[i].CampaignJobName,
                                                        ErrorMessage = MailGeneralBaseFactory.VendorResponses[i].ErrorMessage,
                                                        ProductIds = MailGeneralBaseFactory.VendorResponses[i].ProductIds,
                                                        ResponseId = MailGeneralBaseFactory.VendorResponses[i].ResponseId,
                                                        SendStatus = (byte)MailGeneralBaseFactory.VendorResponses[i].SendStatus,
                                                        WorkFlowDataId = MailGeneralBaseFactory.VendorResponses[i].WorkFlowDataId,
                                                        WorkFlowId = MailGeneralBaseFactory.VendorResponses[i].WorkFlowId,
                                                        SentDate = DateTime.Now,
                                                        MailConfigurationNameId = configration.MailConfigurationNameId
                                                    };

                                                    using (var objDLMailSent = DLMailSent.GetDLMailSent(details.accountId, SQLProvider))
                                                    {
                                                        await objDLMailSent.Send(getmailSent);
                                                    }

                                                    if (getmailSent.SendStatus == 1)
                                                    {
                                                        SentCount++;
                                                        mailSuccessContactList.Add(Helper.MaskEmailAddress(getmailSent.EmailId));
                                                    }
                                                    else
                                                    {
                                                        FailureCount++;
                                                        mailErrorContactList.Add(new Tuple<string, string>(Helper.MaskEmailAddress(getmailSent.EmailId), getmailSent.ErrorMessage));
                                                    }
                                                }
                                            }
                                            // Update MailSendingSetting TotalSent and TotalNotSent Count
                                            UpdateMailSendingSettingStats(details.accountId, mailSendingSetting.Id, SentCount, FailureCount);

                                            Message = "Out of " + contactList.Count + "," + SentCount + " has been sent successfully and " + FailureCount + " has been not sent.";
                                            //LogMessage = "Group test mail has been sent";
                                        }
                                        else
                                        {
                                            Message = "Unable to send because provider is not supporting bulk";
                                            //LogMessage = "Unable to send because provider is not supporting bulk";
                                        }

                                    }
                                    else
                                    {
                                        Message = "With this identifier name already campaign has been sent";
                                        //LogMessage = "Unable to send group test mail as campaign identifier exists";
                                    }
                                }
                                else
                                {
                                    Message = "Total contact in the test group should be less than 30";
                                    //LogMessage = "Unable to send group test mail as contact is more than 30";
                                }
                            }
                            else
                            {
                                Message = "There are no contacts in the selected group to send mail.";
                                //LogMessage = "Unable to send group test mail as no contact found";
                            }
                        }
                    }
                    else
                    {
                        Message = "Please check for the mail configuration setting";
                        //LogMessage = "Unable to send group test mail as configuration not found";
                    }
                }
                else
                {
                    Message = "Please select the group id";
                    //LogMessage = "Unable to send group test mail";
                }
            }
            catch (Exception ex)
            {
                Message = ex.Message.ToString();
                //LogMessage = "Unable to send group test mail";
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { SentCount = SentCount, FailureCount = FailureCount, Message = Message, SuccessList = mailSuccessContactList, ErrorList = mailErrorContactList }), LogMessage);
            return Json(new { SentCount = SentCount, FailureCount = FailureCount, Message = Message, SuccessList = mailSuccessContactList, ErrorList = mailErrorContactList });
        }

        //public JsonResult SendGroupMail(MailSendingSetting mailSendingSetting, MailScheduled mailScheduled, MailDrips[] listOfDrips)
        //{
        //    MLBulkMailSending bulkMailSending = new MLBulkMailSending();

        //    if (Session["AccountInfo"] != null && Session["UserInfo"] != null)
        //    {
        //        List<MailDrips> DripList = null;
        //        if (listOfDrips != null)
        //        {
        //            DripList = listOfDrips.ToList();
        //        }

        //        DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //        LoginInfo user = (LoginInfo)Session["UserInfo"];
        //        #region Logs                
        //        Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Send", "Mail", "SendGroupMail", Helper.GetIP(), JsonConvert.SerializeObject(new { mailSendingSetting = mailSendingSetting, mailScheduled = mailScheduled, listOfDrips = listOfDrips }));
        //        #endregion
        //        MailConfiguration configration = new MailConfiguration();
        //        mailSendingSetting.UserInfoUserId = user.UserId;
        //        mailSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

        //        if (!mailSendingSetting.IsPromotionalOrTransactionalType)
        //        {
        //            using (DLMailConfiguration objDLConfig = new DLMailConfiguration(domainDetails.AdsId))
        //            {
        //                configration = objDLConfig.GetPromotionalDetails(configration);
        //            }
        //        }
        //        else
        //        {
        //            using (DLMailConfiguration objDLConfig = new DLMailConfiguration(domainDetails.AdsId))
        //            {
        //                configration = objDLConfig.GetTransactionalDetails(configration);
        //            }
        //        }

        //        if (configration != null && configration.Id > 0)
        //        {
        //            if (!configration.IsPromotionalOrTransactionalType && configration.ProviderName == "Everlytic")
        //            {
        //                try
        //                {
        //                    CreateAndScheduleMailCampaign objMailCampaign = new CreateAndScheduleMailCampaign();
        //                    bulkMailSending = objMailCampaign.ScheduleEverlyticCampaignMail(domainDetails.AdsId, configration, mailSendingSetting, mailScheduled, DripList);
        //                }
        //                catch (Exception ex)
        //                {
        //                    bulkMailSending.Status = false;
        //                    bulkMailSending.Message = ex.ToString();

        //                    Helper.SendMailOnMajorError("EverlyticMailSending Break=" + domainDetails.AdsId.ToString(), "", ex.ToString());
        //                }
        //            }
        //            else
        //            {
        //                try
        //                {
        //                    CreateAndScheduleMailCampaign objMailCampaign = new CreateAndScheduleMailCampaign();
        //                    bulkMailSending = objMailCampaign.ScheduleCampaignMail(domainDetails.AdsId, configration, mailSendingSetting, mailScheduled, DripList);
        //                }
        //                catch (Exception ex)
        //                {
        //                    bulkMailSending.Status = false;
        //                    bulkMailSending.Message = ex.ToString();

        //                    Helper.SendMailOnMajorError("MailSending Break=" + domainDetails.AdsId.ToString(), "", ex.ToString());
        //                }
        //            }
        //        }
        //        else
        //        {
        //            bulkMailSending = new MLBulkMailSending() { Message = "Please configure setting before sending ", Status = false };
        //        }
        //        TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = bulkMailSending.Status, Message = bulkMailSending.Message, NumberOfMailSent = bulkMailSending.NumberOfMailSent }), bulkMailSending.Message);
        //    }
        //    else
        //    {
        //        bulkMailSending.Message = "Session Expired Please login";
        //        bulkMailSending.Status = false;
        //    }
        //    return Json(new { Status = bulkMailSending.Status, Message = bulkMailSending.Message, NumberOfMailSent = bulkMailSending.NumberOfMailSent }, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult SendSplitTestMail(MailSendingSetting firstMailDetailsSplitTest, MailSendingSetting secondMailDetailsSplitTest, MailSplitTest mailSplitTest)
        //{
        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];
        //    #region Logs                
        //    Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Send", "Mail", "SendSplitTestMail", Helper.GetIP(), JsonConvert.SerializeObject(new { firstMailDetailsSplitTest = firstMailDetailsSplitTest, secondMailDetailsSplitTest = secondMailDetailsSplitTest, mailSplitTest = mailSplitTest }));
        //    #endregion            

        //    MailConfiguration configration = new MailConfiguration();

        //    if (firstMailDetailsSplitTest.IsPromotionalOrTransactionalType == false)
        //    {
        //        using (DLMailConfiguration objDLConfig = new DLMailConfiguration(domainDetails.AdsId))
        //        {
        //            configration = objDLConfig.GetPromotionalDetails(configration);
        //        }
        //    }
        //    else
        //    {
        //        using (DLMailConfiguration objDLConfig = new DLMailConfiguration(domainDetails.AdsId))
        //        {
        //            configration = objDLConfig.GetTransactionalDetails(configration);
        //        }
        //    }

        //    if (configration.Id > 0)
        //    {
        //        List<MLContactForCampaign> contactList = new List<MLContactForCampaign>();

        //        using (BLContactForCampaign objDLCampaignContacts = new BLContactForCampaign(domainDetails.AdsId))
        //        {
        //            contactList = objDLCampaignContacts.GetEmailIdContacts(firstMailDetailsSplitTest.GroupId);
        //        }

        //        if (contactList.Count > 0)
        //        {
        //            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
        //            firstMailDetailsSplitTest.UserInfoUserId = secondMailDetailsSplitTest.UserInfoUserId = user.UserId;
        //            firstMailDetailsSplitTest.UserGroupId = secondMailDetailsSplitTest.UserGroupId = mailSplitTest.UserGroupId = UserGroupId;
        //            mailSplitTest.UserInfoUserId = user.UserId;

        //            using (BLMailSplitTest objBALTest = new BLMailSplitTest(domainDetails.AdsId))
        //            {
        //                firstMailDetailsSplitTest.MailSplitTestId = objBALTest.Save(mailSplitTest);
        //            }

        //            if (firstMailDetailsSplitTest.MailSplitTestId > 0)
        //            {
        //                secondMailDetailsSplitTest.MailSplitTestId = firstMailDetailsSplitTest.MailSplitTestId;
        //                firstMailDetailsSplitTest.IsSchedule = secondMailDetailsSplitTest.IsSchedule = false;

        //                using (DLMailSendingSetting objBAL = new DLMailSendingSetting(domainDetails.AdsId))
        //                {
        //                    firstMailDetailsSplitTest.Id = objBAL.Save(firstMailDetailsSplitTest);

        //                    secondMailDetailsSplitTest.Id = objBAL.Save(secondMailDetailsSplitTest);
        //                }

        //                if (firstMailDetailsSplitTest.Id > 0 && secondMailDetailsSplitTest.Id > 0)
        //                {
        //                    int totalContact = contactList.Count;

        //                    int needToSendFor = (totalContact * mailSplitTest.NumberOfContactInPer) / 100;

        //                    int forEachGroup = needToSendFor / 2;

        //                    List<MailSent> SplitTestMail = new List<MailSent>();
        //                    //First Split Test Contat
        //                    SplitTestMail.AddRange((List<MailSent>)contactList.Take(forEachGroup).Select(x => new MailSent { ContactId = x.ContactId, EmailId = x.EmailId, MailSendingSettingId = firstMailDetailsSplitTest.Id }).ToList());
        //                    //Second Split Test Contat
        //                    SplitTestMail.AddRange((List<MailSent>)contactList.Skip(forEachGroup).Take(forEachGroup).Select(x => new MailSent { ContactId = x.ContactId, EmailId = x.EmailId, MailSendingSettingId = secondMailDetailsSplitTest.Id }).ToList());

        //                    using (DLMailSent objDL = new DLMailSent(domainDetails.AdsId))
        //                    {
        //                        objDL.InsertContactToSendMail(SplitTestMail);
        //                    }

        //                    TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, Message = "Group split test has been scheduled" }), "The group split test mail has been scheduled");
        //                    return Json(new { Status = true, Message = "Group split test has been scheduled" }, JsonRequestBehavior.AllowGet);
        //                }
        //                else
        //                {
        //                    TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, Message = "Problem in scheduling split test, Check Configration once" }), "Unable to send a group split test mail");
        //                    return Json(new { Status = false, Message = "Problem in scheduling split test, Check Configration once" }, JsonRequestBehavior.AllowGet);
        //                }
        //            }
        //            else
        //            {
        //                TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "Problem in saving split test" }), "Unable to send a group split test mail");
        //                return Json(new { Status = false, Message = "Problem in saving split test" }, JsonRequestBehavior.AllowGet);
        //            }
        //        }
        //        else
        //        {
        //            TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "There are no contact in schedule split test" }), "Unable to send a group split test mail");
        //            return Json(new { Status = false, Message = "There are no contact in schedule split test" }, JsonRequestBehavior.AllowGet);
        //        }
        //    }
        //    else
        //    {
        //        TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "Problem in scheduling split test, Check Configration once" }), "Unable to send a group split test mail");
        //        return Json(new { Status = false, Message = "Problem in scheduling split test, Check Configration once" }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        public async Task<JsonResult> PurchaseFeature()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<Purchase> Details = null;
            object data;
            int UserId = 0;
            using (var account = DLAccount.GetDLAccount(SQLProvider))
            {
                UserId = account.GetAccountDetails(domainDetails.AdsId).Result.UserInfoUserId;
            }

            using (var obj = DLPurchase.GetDLPurchase(SQLProvider))
            {
                Details = await obj.GetDetail(UserId);

                data = from feature in Details
                       where feature.FeatureId == 3
                       select feature;

            }
            return Json(data);
        }

        [Log]
        private void UpdateMailSendingSettingStats(int AdsId, int MailSendingSettingId, int SentCount, int NotSentCount)
        {
            using (var objDLStats = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SQLProvider))
            {
                objDLStats.UpdateStats(MailSendingSettingId, SentCount, NotSentCount, false, false);
            }
        }
    }
}
