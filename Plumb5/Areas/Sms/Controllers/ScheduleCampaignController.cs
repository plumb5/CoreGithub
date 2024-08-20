using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;
using System.Text;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class ScheduleCampaignController : BaseController
    {
        public ScheduleCampaignController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Sms/ScheduleCampaign/

        public ActionResult Index()
        {
            return View("ScheduleCampaign");
        }

        [HttpPost]
        public async Task<JsonResult> GetSmsSendingSettingDetails([FromBody] ScheduleCampaignDto_GetSmsSendingSettingDetails commonDetails)
        {
            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.Get(commonDetails.SmsSendingSettingId));
            }
        }

        [HttpPost]
        public JsonResult GetScheduledMultiBatchDetails([FromBody] ScheduleCampaignDto_GetScheduledMultiBatchDetails commonDetails)
        {
            using (var objDL = DLSmsBulkSentTimeSplitSchedule.GetDLSmsBulkSentTimeSplitSchedule(commonDetails.accountId, SQLProvider))
            {
                return Json(objDL.GetSmsBulkSentTimeSplitScheduleDetails(new SmsBulkSentTimeSplitSchedule() { SmsSendingSettingId = commonDetails.SmsSendingSettingId }));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignList([FromBody] ScheduleCampaignDto_GetCampaignList commonDetails)
        {
            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetList(new CampaignIdentifier(), 0, 0));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] ScheduleCampaignDto_GetCampaignList commonDetails)
        {
            using (var objDL = DLGroups.GetDLGroups(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplateList([FromBody] ScheduleCampaignDto_GetCampaignList commonDetails)
        {
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetTemplateDetails(new SmsTemplate()));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetUniquePhoneContact([FromBody] ScheduleCampaignDto_GetUniquePhoneContact commonDetails)
        {
            using (var objDL = DLGroupMember.GetDLGroupMember(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetUniquePhoneContact(commonDetails.ListOfGroupId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> CheckIdentifierUniqueness([FromBody] ScheduleCampaignDto_CheckIdentifierUniqueness commonDetails)
        {
            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.CheckIdentifier(commonDetails.IdentifierName));
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupAnalysisDetails([FromBody] ScheduleCampaignDto_GetGroupAnalysisDetails commonDetails)
        {
            try
            {
                DataSet ds;
                using (var objDL = DLSmsSent.GetDLSmsSent(commonDetails.accountId, SQLProvider))
                {
                    ds = await objDL.GetOpenAndClickedRate(commonDetails.GroupIds);
                }

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupCreateAndMergeContact([FromBody] ScheduleCampaignDto_GroupCreateAndMergeContact commonDetails)
        {
            bool Result = false;
            string Message;
            using (var objDL = DLGroups.GetDLGroups(commonDetails.accountId, SQLProvider))
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                commonDetails.groupDetails.UserInfoUserId = user.UserId;
                commonDetails.groupDetails.Id = await objDL.Save(commonDetails.groupDetails);
            }

            if (commonDetails.groupDetails.Id > 0)
            {
                using (var objDL = DLGroupMember.GetDLGroupMember(commonDetails.accountId, SQLProvider))
                {
                    Result = await objDL.MergeDistinctContactIntoGroupByPhoneNumber(commonDetails.ListOfGroupId, commonDetails.groupDetails.Id, commonDetails.groupDetails.UserInfoUserId);
                }

                if (Result)
                    Message = "Group with '" + commonDetails.groupDetails.Name + "' has been created and all contacts inserted into this group.";
                else
                    Message = "Unable to merge contacts into the '" + commonDetails.groupDetails.Name + "' group, Please try again after sometime.";
            }
            else
            {
                Message = "Group with '" + commonDetails.groupDetails.Name + "' name already exists, please try with another name.";
            }

            return Json(new { Result, Message, commonDetails.groupDetails });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendIndividualTestSMS([FromBody] ScheduleCampaignDto_SendIndividualTestSMS commonDetails)
        {
            SmsConfiguration? smsConfiguration = new SmsConfiguration();
            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";
            string VendorTemplateId = "0";
            //string P5SMSUniqueID = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string P5UniqueID = Guid.NewGuid().ToString();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool? IsPromotionalOrTransactionalType = null;
            string? MessageContent = null;
            bool? ConvertLinkToShortenUrl = null;
            List<SmsTemplateUrl> smsUrlList = null;

            if (commonDetails.SmsTemplateId == 0)
            {
                if (HttpContext.Session.GetString("TemplateData") != null)
                {
                    var SmsTemplateData = JsonConvert.DeserializeObject<SmsTemplate>(HttpContext.Session.GetString("TemplateData"));
                    VendorTemplateId = SmsTemplateData.VendorTemplateId == null ? "0" : SmsTemplateData.VendorTemplateId.ToString();
                    IsPromotionalOrTransactionalType = SmsTemplateData.IsPromotionalOrTransactionalType;
                }
            }

            if (commonDetails.IsPromotionalOrTransactionalType)
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(commonDetails.accountId, SQLProvider))
                {
                    smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, SmsConfigurationNameId: commonDetails.SmsConfigurationNameId);
                }
            }
            else
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(commonDetails.accountId, SQLProvider))
                {
                    smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(false, SmsConfigurationNameId: commonDetails.SmsConfigurationNameId);
                }
            }

            if (smsConfiguration != null && smsConfiguration.Id > 0)
            {
                if (!smsConfiguration.IsPromotionalOrTransactionalType && smsConfiguration.ProviderName.ToLower() == "everlytic")
                {
                    SentStatus = false;
                    Message = "You cannot send test sms for everlytic promotional";
                }
                else if (smsConfiguration.IsBulkSupported.HasValue && smsConfiguration.IsBulkSupported.Value)
                {
                    Contact? contactDetails = new Contact() { PhoneNumber = commonDetails.PhoneNumber };

                    using (var objDL = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
                    {
                        contactDetails = await objDL.GetDetails(contactDetails, null, true);
                    }

                    if (contactDetails == null)
                    {
                        contactDetails = new Contact() { PhoneNumber = commonDetails.PhoneNumber };
                    }

                    if (commonDetails.SmsTemplateId != 0)
                    {
                        SmsTemplate? smsTemplate;
                        using (var objDL = DLSmsTemplate.GetDLSmsTemplate(commonDetails.accountId, SQLProvider))
                        {
                            smsTemplate = await objDL.GetDetails(commonDetails.SmsTemplateId);
                        }

                        if (smsTemplate != null)
                        {
                            MessageContent = System.Web.HttpUtility.HtmlDecode(smsTemplate.MessageContent);
                            VendorTemplateId = smsTemplate.VendorTemplateId;
                            ConvertLinkToShortenUrl = smsTemplate.ConvertLinkToShortenUrl;
                        }
                        using (var objsmstempUrl = DLSmsTemplateUrl.GetDLSmsTemplateUrl(commonDetails.accountId, SQLProvider))
                        {
                            smsUrlList = (await objsmstempUrl.GetDetail(commonDetails.SmsTemplateId)).ToList();
                        }
                    }

                    if (MessageContent != null)
                    {
                        MessageContent = System.Web.HttpUtility.HtmlDecode(MessageContent);

                        HelperForSMS HelpSMS = new HelperForSMS(commonDetails.accountId, SQLProvider);
                        ConvertURLToShortenLink helpconvert = new ConvertURLToShortenLink(commonDetails.accountId, SQLProvider);

                        StringBuilder Bodydata = new StringBuilder();
                        Bodydata.Append(MessageContent);
                        await HelpSMS.ReplaceMessageWithSMSUrl("campaign", Bodydata, 0, contactDetails.ContactId, smsUrlList, P5UniqueID);

                        //if (Convert.ToBoolean(ConvertLinkToShortenUrl))
                        //    helpconvert.GenerateShortenLinkByUrl(Bodydata, contactDetails, SmsTemplateId, 0, P5SMSUniqueID);

                        //HelpSMS.ReplaceContactDetails(Bodydata, contactDetails);
                        await HelpSMS.ReplaceContactDetails(Bodydata, contactDetails, commonDetails.accountId, "", commonDetails.SmsTemplateId, 0, P5UniqueID, "sms", Convert.ToBoolean(ConvertLinkToShortenUrl));

                        //LmsGroupMembers lmsDetails = null;
                        //using (DLLmsGroupMembers objDL = new DLLmsGroupMembers(accountId))
                        //    lmsDetails = objDL.GetLmsDetails(contactid: contactDetails.ContactId);

                        //if (lmsDetails != null)
                        //{
                        //    HelpSMS.ReplaceLmsDetails(Bodydata, lmsDetails);
                        //}

                        //replace the lms custom field data
                        if ((Bodydata.ToString().Contains("[{*")) && (Bodydata.ToString().Contains("*}]")))
                            await Bodydata.LmsUserInfoFieldsReplacement(commonDetails.accountId, 0, contactDetails.ContactId, SqlVendor: SQLProvider);

                        MessageContent = Bodydata.ToString();

                        if (MessageContent.Contains("[{*") && MessageContent.Contains("*}]"))
                        {
                            SentStatus = false;
                            Message = "Template dynamic content not replaced";
                        }
                        else
                        {
                            bool IsUnicodeMessage = Helper.ContainsUnicodeCharacter(MessageContent);
                            List<SmsSent> smsSentList = new List<SmsSent>();
                            SmsSent smsSent = new SmsSent()
                            {
                                CampaignJobName = "campaign",
                                ContactId = contactDetails.ContactId,
                                GroupId = 0,
                                MessageContent = MessageContent,
                                PhoneNumber = contactDetails.PhoneNumber,
                                SmsSendingSettingId = 0,
                                SmsTemplateId = commonDetails.SmsTemplateId,
                                VendorName = smsConfiguration.ProviderName,
                                IsUnicodeMessage = IsUnicodeMessage,
                                VendorTemplateId = VendorTemplateId,
                                P5SMSUniqueID = P5UniqueID

                            };
                            smsSentList.Add(smsSent);

                            IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(commonDetails.accountId, smsConfiguration, "campaign", SqlVendor: SQLProvider);
                            SentStatus = SmsGeneralBaseFactory.SendBulkSms(smsSentList);
                            Message = SmsGeneralBaseFactory.ErrorMessage;

                            if (SmsGeneralBaseFactory.VendorResponses != null && SmsGeneralBaseFactory.VendorResponses.Count > 0)
                            {
                                ResponseId = SmsGeneralBaseFactory.VendorResponses[0].ResponseId;
                                Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                smsSent.SentDate = DateTime.Now;
                                smsSent.IsDelivered = 0;
                                smsSent.IsClicked = 0;
                                smsSent.Operator = null;
                                smsSent.Circle = null;
                                smsSent.DeliveryTime = null;
                                smsSent.P5SMSUniqueID = P5UniqueID;
                                smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;
                                smsSent.UserInfoUserId = user.UserId;
                                using (var objDL = DLSmsSent.GetDLSmsSent(commonDetails.accountId, SQLProvider))
                                {
                                    await objDL.Save(smsSent);
                                }
                            }
                        }
                    }
                    else
                    {
                        SentStatus = false;
                        Message = "Template not found";
                    }
                }
            }
            else
            {
                SentStatus = false;
                Message = "You have not configured for sms";
            }
            return Json(new { SentStatus, Message, MessageContent, ResponseId });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendGroupTestSMS([FromBody] ScheduleCampaignDto_SendGroupTestSMS commonDetails)
        {
            SmsConfiguration? CurrentConfiguration = new SmsConfiguration();

            if (commonDetails.smsSendingSetting.IsPromotionalOrTransactionalType)
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(commonDetails.accountId, SQLProvider))
                {
                    CurrentConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, SmsConfigurationNameId: commonDetails.smsSendingSetting.SmsConfigurationNameId);
                }
            }
            else
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(commonDetails.accountId, SQLProvider))
                {
                    CurrentConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(false, SmsConfigurationNameId: commonDetails.smsSendingSetting.SmsConfigurationNameId);
                }
            }

            string Message = "";
            string MessageContent = "";

            int SentCount = 0;
            int FailureCount = 0;
            int UnsubscribedCount = 0;
            List<Tuple<string, string>> smsErrorContactList = new List<Tuple<string, string>>();
            List<Tuple<string, string>> smsSuccessContactList = new List<Tuple<string, string>>();

            if (CurrentConfiguration != null)
            {
                if (!CurrentConfiguration.IsPromotionalOrTransactionalType && CurrentConfiguration.ProviderName == "Everlytic")
                {
                    Message = "Test sms cannot be sent for Everlytic promotional";
                }
                else
                {
                    List<GroupMember> GroupMemberList;
                    using (var objDL = DLGroupMember.GetDLGroupMember(commonDetails.accountId, SQLProvider))
                    {
                        GroupMemberList = await objDL.GET(new GroupMember() { GroupId = commonDetails.smsSendingSetting.GroupId }, -1, -1, "");
                    }

                    if (GroupMemberList != null && GroupMemberList.Count > 0)
                    {
                        List<int> ContactIdList = GroupMemberList.Select(x => x.ContactId).Distinct().ToList();
                        if (ContactIdList != null && ContactIdList.Count > 0 && ContactIdList.Count <= 30)
                        {
                            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                            string SendingSettingName = ("Test_" + Helper.GenerateUniqueNumber() + "_" + commonDetails.smsSendingSetting.Name);

                            commonDetails.smsSendingSetting.Name = SendingSettingName.Length > 50 ? SendingSettingName.Substring(0, 50) : SendingSettingName;
                            commonDetails.smsSendingSetting.UserInfoUserId = user.UserId;
                            commonDetails.smsSendingSetting.UserGroupId = user.UserGroupIdList.Count > 0 ? user.UserGroupIdList[0] : 0;
                            commonDetails.smsSendingSetting.ScheduledStatus = 1;
                            commonDetails.smsSendingSetting.TotalContact = ContactIdList.Count;
                            commonDetails.smsSendingSetting.ScheduledDate = DateTime.Now;
                            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
                            {
                                commonDetails.smsSendingSetting.Id = await objDL.Save(commonDetails.smsSendingSetting);
                            }
                            if (commonDetails.smsSendingSetting.Id > 0)
                            {
                                List<Contact> contactList;
                                using (var objDLcontact = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
                                {
                                    contactList = await objDLcontact.GetAllContactList(ContactIdList, true);
                                }

                                string ProviderName = CurrentConfiguration.ProviderName.ToLower();

                                if (CurrentConfiguration.IsBulkSupported.HasValue && CurrentConfiguration.IsBulkSupported.Value)
                                {
                                    SmsTemplate? smsTemplate;
                                    string VendorTemplateId = "0";
                                    using (var objsmstemp = DLSmsTemplate.GetDLSmsTemplate(commonDetails.accountId, SQLProvider))
                                    {
                                        smsTemplate = await objsmstemp.GetDetails(commonDetails.smsSendingSetting.SmsTemplateId);
                                    }

                                    if (smsTemplate != null)
                                    {
                                        MessageContent = System.Web.HttpUtility.HtmlDecode(smsTemplate.MessageContent);
                                        VendorTemplateId = smsTemplate.VendorTemplateId;
                                        HelperForSMS HelpSMS = new HelperForSMS(commonDetails.accountId, SQLProvider);
                                        List<SmsTemplateUrl> smsUrlList;
                                        using (var objsmstempUrl = DLSmsTemplateUrl.GetDLSmsTemplateUrl(commonDetails.accountId, SQLProvider))
                                        {
                                            smsUrlList = (await objsmstempUrl.GetDetail(commonDetails.smsSendingSetting.SmsTemplateId)).ToList();
                                        }

                                        List<SmsSent> smsSentList = new List<SmsSent>();

                                        for (int i = 0; i < contactList.Count; i++)
                                        {
                                            if (contactList[i].IsSmsUnsubscribe.HasValue && contactList[i].IsSmsUnsubscribe.Value)
                                            {
                                                UnsubscribedCount++;
                                                smsErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(contactList[i].PhoneNumber), "Contact Is Unsubscribed"));
                                            }
                                            else
                                            {
                                                string P5UniqueID = Guid.NewGuid().ToString();

                                                StringBuilder Bodydata = new StringBuilder();
                                                Bodydata.Clear().Append(MessageContent);
                                                await HelpSMS.ReplaceMessageWithSMSUrl("campaign", Bodydata, commonDetails.smsSendingSetting.Id, contactList[i].ContactId, smsUrlList, P5UniqueID);
                                                await HelpSMS.ReplaceContactDetails(Bodydata, contactList[i], commonDetails.accountId, "", smsTemplate.Id, 0, P5UniqueID, "sms", smsTemplate.ConvertLinkToShortenUrl);

                                                //LmsGroupMembers lmsDetails = null;
                                                //using (DLLmsGroupMembers objDL = new DLLmsGroupMembers(accountId))
                                                //    lmsDetails = objDL.GetLmsDetails(contactid: contactList[i].ContactId);

                                                //if (lmsDetails != null)
                                                //{
                                                //    HelpSMS.ReplaceLmsDetails(Bodydata, lmsDetails);
                                                //}

                                                //replace the lms custom field data
                                                if ((Bodydata.ToString().Contains("[{*")) && (Bodydata.ToString().Contains("*}]")))
                                                    await Bodydata.LmsUserInfoFieldsReplacement(commonDetails.accountId, 0, contactList[i].ContactId, SqlVendor: SQLProvider);

                                                string ReplacedMessageContent = Bodydata.ToString();

                                                if (ReplacedMessageContent.Contains("[{*") && ReplacedMessageContent.Contains("*}]"))
                                                {
                                                    FailureCount++;
                                                    smsErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(contactList[i].PhoneNumber), "Template dynamic content not replaced"));

                                                    SmsSent smsNotSent = new SmsSent()
                                                    {
                                                        CampaignJobName = "campaign",
                                                        ContactId = contactList[i].ContactId,
                                                        GroupId = commonDetails.smsSendingSetting.GroupId,
                                                        MessageContent = ReplacedMessageContent,
                                                        PhoneNumber = contactList[i].PhoneNumber,
                                                        SmsSendingSettingId = commonDetails.smsSendingSetting.Id,
                                                        SmsTemplateId = commonDetails.smsSendingSetting.SmsTemplateId,
                                                        VendorName = ProviderName,
                                                        ResponseId = P5UniqueID,
                                                        IsUnicodeMessage = Helper.ContainsUnicodeCharacter(ReplacedMessageContent),
                                                        SentDate = DateTime.Now,
                                                        IsDelivered = 0,
                                                        IsClicked = 0,
                                                        Operator = null,
                                                        Circle = null,
                                                        DeliveryTime = null,
                                                        ReasonForNotDelivery = "Template dynamic content not replaced",
                                                        SendStatus = 0,
                                                        TriggerMailSMSId = 0,
                                                        WorkFlowDataId = 0,
                                                        WorkFlowId = 0,
                                                        VendorTemplateId = VendorTemplateId,
                                                        SmsConfigurationNameId = CurrentConfiguration.SmsConfigurationNameId,
                                                        UserInfoUserId = user.UserId
                                                    };

                                                    using (var objDL = DLSmsSent.GetDLSmsSent(commonDetails.accountId, SQLProvider))
                                                    {
                                                        await objDL.Save(smsNotSent);
                                                    }
                                                }
                                                else
                                                {
                                                    SmsSent smsSent = new SmsSent()
                                                    {
                                                        CampaignJobName = "campaign",
                                                        ContactId = contactList[i].ContactId,
                                                        GroupId = commonDetails.smsSendingSetting.GroupId,
                                                        MessageContent = ReplacedMessageContent,
                                                        PhoneNumber = contactList[i].PhoneNumber,
                                                        SmsSendingSettingId = commonDetails.smsSendingSetting.Id,
                                                        SmsTemplateId = commonDetails.smsSendingSetting.SmsTemplateId,
                                                        VendorName = ProviderName,
                                                        ResponseId = P5UniqueID,
                                                        IsUnicodeMessage = Helper.ContainsUnicodeCharacter(ReplacedMessageContent),
                                                        VendorTemplateId = VendorTemplateId,
                                                        UserInfoUserId = user.UserId
                                                    };

                                                    smsSentList.Add(smsSent);
                                                }
                                            }
                                        }

                                        if (smsSentList != null && smsSentList.Count > 0)
                                        {
                                            IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(commonDetails.accountId, CurrentConfiguration, "campaign", SQLProvider);
                                            bool SentStatus = SmsGeneralBaseFactory.SendBulkSms(smsSentList);
                                            string ErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                                            if (SmsGeneralBaseFactory.VendorResponses != null && SmsGeneralBaseFactory.VendorResponses.Count > 0)
                                            {
                                                for (int i = 0; i < SmsGeneralBaseFactory.VendorResponses.Count; i++)
                                                {
                                                    SmsSent smsSent = new SmsSent();
                                                    Helper.Copy(SmsGeneralBaseFactory.VendorResponses[i], smsSent);

                                                    smsSent.SentDate = DateTime.Now;
                                                    smsSent.IsDelivered = 0;
                                                    smsSent.IsClicked = 0;
                                                    smsSent.Operator = null;
                                                    smsSent.Circle = null;
                                                    smsSent.DeliveryTime = null;
                                                    smsSent.SmsConfigurationNameId = CurrentConfiguration.SmsConfigurationNameId;

                                                    if (SmsGeneralBaseFactory.VendorResponses[i].SendStatus == 0)
                                                    {
                                                        FailureCount++;
                                                        smsErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(smsSent.PhoneNumber), SmsGeneralBaseFactory.VendorResponses[i].ReasonForNotDelivery));
                                                    }
                                                    else if (SmsGeneralBaseFactory.VendorResponses[i].SendStatus == 1)
                                                    {
                                                        SentCount++;
                                                        smsSuccessContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(smsSent.PhoneNumber), SmsGeneralBaseFactory.VendorResponses[i].ResponseId));
                                                    }
                                                    else
                                                    {
                                                        FailureCount++;
                                                        smsErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(smsSent.PhoneNumber), ErrorMessage));
                                                    }

                                                    using (var objDL = DLSmsSent.GetDLSmsSent(commonDetails.accountId, SQLProvider))
                                                    {
                                                        await objDL.Save(smsSent);
                                                    }
                                                }

                                                // Update SmsSendingSetting TotalSent and TotalNotSent Count
                                                using (var objDLStats = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
                                                {
                                                    await objDLStats.UpdateSentCount(commonDetails.smsSendingSetting.Id, SentCount, FailureCount);
                                                }
                                            }
                                            Message = "Out of " + contactList.Count + "," + SentCount + " has been sent successfully, " + FailureCount + " has been not sent, and " + UnsubscribedCount + " has been opted out from the channel.";
                                        }
                                        else
                                        {
                                            Message = "Out of " + contactList.Count + "," + SentCount + " has been sent successfully, " + FailureCount + " has been not sent, and " + UnsubscribedCount + " has been opted out from the channel.";
                                        }
                                    }
                                    else
                                    {
                                        Message = "Template Not Found";
                                    }
                                }
                            }
                            else
                            {
                                Message = "With this identifier name already test campaign has been sent";
                            }
                        }
                        else
                        {
                            Message = "Total contact in the test group should be less than 30";
                        }
                    }
                    else
                    {
                        Message = "There are no contacts in the selected group to send sms.";
                    }
                }
            }
            else
            {
                Message = "You have not configured for sms";
            }

            return Json(new
            {
                SentCount,
                FailureCount,
                UnsubscribedCount,
                Message,
                MessageContent,
                SuccessList = smsSuccessContactList,
                ErrorList = smsErrorContactList
            });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveSingleScheduleSMS([FromBody] ScheduleCampaignDto_SaveSingleScheduleSMS commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            commonDetails.smsSendingSetting.UserInfoUserId = user.UserId;
            commonDetails.smsSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            bool result = false;
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedule Campaign ", "Sms", "SaveSingleScheduleSMS", Helper.GetIP(), JsonConvert.SerializeObject(new { smsSendingSetting = smsSendingSetting, EditCopyAction = EditCopyAction }));
            //#endregion
            SmsSendingSetting smsSendingSetting = new SmsSendingSetting();
            Helper.CopyWithDateTimeWhenString(commonDetails.smsSendingSetting, smsSendingSetting);

            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                if (commonDetails.EditCopyAction != null && commonDetails.EditCopyAction != string.Empty && commonDetails.EditCopyAction.ToLower() == "edit" && commonDetails.smsSendingSetting.Id > 0)
                {

                    result = await objDL.UpdateScheduledCampaign(smsSendingSetting);
                    //LogMessage = "Updated successfully";
                }
                else
                {
                    commonDetails.smsSendingSetting.Id = await objDL.Save(smsSendingSetting);
                    if (commonDetails.smsSendingSetting.Id > 0)
                        result = true;
                    else
                        result = false;
                    //if (smsSendingSetting.Id > 0)
                    //    LogMessage = "Saved successfully";
                    //else
                    //    LogMessage = "Unable to save";
                }
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Id = smsSendingSetting.Id }), LogMessage);
            return Json(new { commonDetails.smsSendingSetting, result });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveMultiBatchScheduleSMS([FromBody] ScheduleCampaignDto_SaveMultiBatchScheduleSMS commonDetails)
        {
            bool Status;
            string Message;
            int NumberOfSmsSent = 0;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedule Campaign ", "Sms", "SaveMultiBatchScheduleSMS", Helper.GetIP(), JsonConvert.SerializeObject(new { smsSendingSetting = smsSendingSetting, smsTimeSplitScheduled = smsTimeSplitScheduled, EditCopyAction = EditCopyAction }));
            //#endregion

            commonDetails.smsSendingSetting.UserInfoUserId = user.UserId;
            commonDetails.smsSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            commonDetails.smsSendingSetting.ScheduledStatus = 0;
            commonDetails.smsSendingSetting.ScheduledDate = commonDetails.smsTimeSplitScheduled != null && commonDetails.smsTimeSplitScheduled.Count > 0 ? commonDetails.smsTimeSplitScheduled[commonDetails.smsTimeSplitScheduled.Count - 1].ScheduleDate : DateTime.Now;

            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                if (commonDetails.EditCopyAction != null && commonDetails.EditCopyAction != string.Empty && commonDetails.EditCopyAction.ToLower() == "edit" && commonDetails.smsSendingSetting.Id > 0)
                {
                    await objDL.UpdateScheduledCampaign(commonDetails.smsSendingSetting);
                }
                else
                {
                    commonDetails.smsSendingSetting.Id = await objDL.Save(commonDetails.smsSendingSetting);
                }
            }

            if (commonDetails.smsSendingSetting.Id > 0)
            {
                if (commonDetails.smsTimeSplitScheduled != null && commonDetails.smsTimeSplitScheduled.Count > 0)
                {
                    int SavedCount = 0;
                    int FailedCount = 0;
                    for (int i = 0; i < commonDetails.smsTimeSplitScheduled.Count; i++)
                    {
                        int SavedId = 0;
                        using (var objDL = DLSmsBulkSentTimeSplitSchedule.GetDLSmsBulkSentTimeSplitSchedule(commonDetails.accountId, SQLProvider))
                        {
                            if (commonDetails.smsTimeSplitScheduled[i].Id > 0 && commonDetails.EditCopyAction != null && commonDetails.EditCopyAction != string.Empty && commonDetails.EditCopyAction.ToLower() == "edit")
                            {
                                if (commonDetails.smsTimeSplitScheduled[i].IsBulkIntialized == false)
                                {
                                    await objDL.UpdateScheduledDate(new SmsBulkSentTimeSplitSchedule()
                                    {
                                        Id = commonDetails.smsTimeSplitScheduled[i].Id,
                                        ScheduleDate = commonDetails.smsTimeSplitScheduled[i].ScheduleDate
                                    });
                                    SavedId = commonDetails.smsTimeSplitScheduled[i].Id;
                                }
                            }
                            else
                            {
                                SavedId = await objDL.Save(new SmsBulkSentTimeSplitSchedule()
                                {
                                    SmsSendingSettingId = commonDetails.smsSendingSetting.Id,
                                    IsPercentageORCount = commonDetails.smsTimeSplitScheduled[i].IsPercentageORCount,
                                    ValueOfPercentOrCount = commonDetails.smsTimeSplitScheduled[i].ValueOfPercentOrCount,
                                    OffSet = commonDetails.smsTimeSplitScheduled[i].OffSet,
                                    FetchNext = commonDetails.smsTimeSplitScheduled[i].FetchNext,
                                    ScheduleDate = commonDetails.smsTimeSplitScheduled[i].ScheduleDate
                                });
                            }
                        }

                        if (SavedId > 0)
                        {
                            SavedCount++;
                        }
                        else
                        {
                            FailedCount++;
                        }
                    }

                    Status = true;
                    Message = "Out of " + commonDetails.smsTimeSplitScheduled.Count + " schedule. " + SavedCount + " saved and " + FailedCount + " failed.";
                }
                else
                {
                    Status = false;
                    Message = "Please try after some time.";
                }
            }
            else
            {
                Status = false;
                Message = "With this identifier name already campaign has been done.";
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { SmsSendingSettingId = smsSendingSetting.Id }), LogMessage);
            return Json(new { Status, Message, NumberOfSmsSent });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteCampaign([FromBody] ScheduleCampaignDto_DeleteCampaign commonDetails)
        {
            using (var objDL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.Delete(commonDetails.SmsSendingSettingId));
            }
        }

        [HttpPost]
        public async Task<IActionResult> CheckCredits([FromBody] ScheduleCampaignDto_CheckCredits commonDetails)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                UserInfoUserId = (await objDL.GetAccountDetails(commonDetails.accountId)).UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                using (var objDL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData = await objDL.GetDailyConsumptionedDetails(commonDetails.accountId, UserInfoUserId);
                    getCredits = PurchaseData.TotalSmsRemaining;
                    result = getCredits >= commonDetails.TotalContacts ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits });
        }
    }
}
