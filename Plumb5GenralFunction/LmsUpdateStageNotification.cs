using IP5GenralDL;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Plumb5GenralFunction
{
    public class LmsUpdateStageNotification : IDisposable
    {
        public string? UserAssigned { get; set; }

        public bool IsBulkAssignment;
        public List<string> BulkUserInfoUserIds { get; set; }
        public List<string> BulkUserInfoUserName { get; set; }
        public int AssignedUserInfoUserId { get; set; }
        private readonly string? SqlVendor;

        public LmsUpdateStageNotification(bool BulkAssignment = false, string? sqlVendor = null)
        {
            SqlVendor = sqlVendor;
            IsBulkAssignment = BulkAssignment;
            BulkUserInfoUserIds = new List<string>();
            BulkUserInfoUserName = new List<string>();
        }
        public async Task<bool> UpdateStageNotification(MLContact mLContact, List<string> stages, string leadEmailId, int UserInfoUserId, int AdsId, int UserId, string SqlProvider, string LmsGroupName = null)
        {
            MLUserHierarchy MyHierarchy = null;
            List<MLUserHierarchy> userHierarchy = null;
            List<string> EmailIds = new List<string>();
            List<string> PhoneNumbers = new List<string>();
            List<string> WhatsAppPhoneNumbers = new List<string>();
            UserInfo UserDetails = new UserInfo();

            using (var objDL = DLUserInfo.GetDLUserInfo(SqlProvider))
            {
                UserDetails = await objDL.GetDetail(UserId);
            }

            using (var objLms = DLLmsStageNotification.GetDLLmsStageNotification(AdsId, SqlProvider))
            {
                LmsStageNotification lmsStageNotification = await objLms.GET(mLContact.Score);
                if (!IsBulkAssignment)
                {
                    if (lmsStageNotification != null)
                    {
                        if (lmsStageNotification.Mail == true || lmsStageNotification.Sms == true || lmsStageNotification.WhatsApp == true || lmsStageNotification.ReportToSeniorId == true || lmsStageNotification.UserGroupId > 0)
                        {
                            if (lmsStageNotification.ReportToSeniorId == true)
                            {
                                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SqlProvider))
                                {
                                    MyHierarchy = await objUserHierarchy.GetUsersSenior(UserInfoUserId);

                                    if (MyHierarchy != null)
                                    {
                                        if (!String.IsNullOrEmpty(MyHierarchy.EmailId))
                                            EmailIds.Add(MyHierarchy.EmailId);

                                        if (!String.IsNullOrEmpty(MyHierarchy.MobilePhone))
                                            PhoneNumbers.Add(MyHierarchy.MobilePhone);
                                    }
                                }
                            }
                            if (lmsStageNotification.UserGroupId != 0)
                            {
                                using (var objUserGroup = DLUserGroupMembers.GetDLUserGroupMembers(SqlProvider))
                                {
                                    userHierarchy = await objUserGroup.GetHisUsers(lmsStageNotification.UserGroupId);

                                    if (userHierarchy != null && userHierarchy.Count > 0)
                                    {
                                        for (int a = 0; a < userHierarchy.Count(); a++)
                                        {
                                            if (!String.IsNullOrEmpty(userHierarchy[a].EmailId))
                                                EmailIds.Add(userHierarchy[a].EmailId);

                                            if (!String.IsNullOrEmpty(userHierarchy[a].MobilePhone))
                                                PhoneNumbers.Add(userHierarchy[a].MobilePhone);
                                        }
                                    }
                                }
                            }

                            if (lmsStageNotification.Mail == true && !String.IsNullOrEmpty(lmsStageNotification.EmailIds))
                            {
                                string[] mailIdList = lmsStageNotification.EmailIds.Split(',');

                                foreach (string emailId in mailIdList)
                                {
                                    EmailIds.Add(emailId.Trim());
                                }
                            }

                            if (EmailIds != null && EmailIds.Count > 0)
                            {
                                EmailIds = EmailIds.Distinct().ToList();
                                Mail(EmailIds, UserDetails, stages, AdsId, leadEmailId, LmsGroupName, SqlProvider);
                            }

                            if (lmsStageNotification.Sms == true && !String.IsNullOrEmpty(lmsStageNotification.PhoneNos))
                            {
                                string[] smsList = lmsStageNotification.PhoneNos.Split(',');

                                foreach (string phonenumber in smsList)
                                {
                                    PhoneNumbers.Add(phonenumber);
                                }
                            }
                            if (lmsStageNotification.WhatsApp == true && !String.IsNullOrEmpty(lmsStageNotification.WhatsappPhoneNos))
                            {
                                string[] whatsapplist = lmsStageNotification.WhatsappPhoneNos.Split(',');

                                foreach (string whatsappphonenumber in whatsapplist)
                                {
                                    WhatsAppPhoneNumbers.Add(whatsappphonenumber);
                                }
                            }

                            if (PhoneNumbers != null && PhoneNumbers.Count > 0)
                            {
                                PhoneNumbers = PhoneNumbers.Distinct().ToList();
                                SMS(PhoneNumbers, UserDetails, stages, AdsId, leadEmailId, LmsGroupName, SqlProvider);
                            }
                            if (WhatsAppPhoneNumbers != null && WhatsAppPhoneNumbers.Count > 0)
                            {
                                WhatsAppPhoneNumbers = WhatsAppPhoneNumbers.Distinct().ToList();
                                WhatsApp(WhatsAppPhoneNumbers, UserDetails, stages, AdsId, leadEmailId, LmsGroupName, SqlProvider);
                            }
                            if (lmsStageNotification.WhatsAppTemplateId > 0 && lmsStageNotification.WhatsAppTemplateId != null && !String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "null")
                            {
                                SendWhatsAappToLead(AdsId, lmsStageNotification.WhatsAppTemplateId, mLContact.PhoneNumber, 0, SqlProvider);
                            }
                            if (lmsStageNotification.SmsTemplateId > 0 && lmsStageNotification.SmsTemplateId != null && !String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "null")
                            {
                                SendSmsToLead(AdsId, lmsStageNotification.SmsTemplateId, mLContact.PhoneNumber, SqlProvider);
                            }
                            if (lmsStageNotification.MailTemplateId > 0 && lmsStageNotification.MailTemplateId != null && !String.IsNullOrEmpty(mLContact.EmailId) && mLContact.PhoneNumber != "null" && mLContact.PhoneNumber != "undefined")
                            {

                                SendMailToLead(AdsId, lmsStageNotification.MailTemplateId, mLContact.EmailId, mLContact.ContactId, SqlProvider);
                            }

                        }
                    }
                }

                using (var objDL = DLContact.GetContactDetails(AdsId, SqlProvider))
                {
                    if (await objDL.UpdateStage(mLContact))
                    {
                        if (lmsStageNotification != null && (lmsStageNotification.AssignUserInfoUserId > 0 || lmsStageNotification.AssignUserGroupId > 0))
                            return await AssignDependingUponStage(AdsId, mLContact, lmsStageNotification, LmsGroupName, SqlProvider);
                        else
                            return true;
                    }
                }
            }
            return false;
        }

        public async Task<bool> AssignDependingUponStage(int AdsId, MLContact? mLContact, LmsStageNotification lmsStageNotification, string LmsGroupName = null, string SqlProvider = null)
        {
            if (lmsStageNotification != null)
            {
                if (lmsStageNotification.AssignUserInfoUserId > 0)
                {
                    if (lmsStageNotification.AssignUserInfoUserId != mLContact.UserInfoUserId)
                    {
                        using (var objUserInfo = DLUserInfo.GetDLUserInfo(SqlProvider))
                        {
                            UserInfo? user = await objUserInfo.GetDetail(lmsStageNotification.AssignUserInfoUserId);
                            UserAssigned = user.FirstName;
                        }
                        return await Assign(AdsId, mLContact.ContactId, lmsStageNotification.AssignUserInfoUserId, mLContact, true, true, true, LmsGroupName, SqlProvider);
                    }
                }
                else if (lmsStageNotification.AssignUserGroupId > 0)
                {
                    List<MLUserHierarchy> userHierarchy = null;
                    using (var objUserGroup = DLUserGroupMembers.GetDLUserGroupMembers(SqlProvider))
                    {
                        userHierarchy = (await objUserGroup.GetHisUsers(lmsStageNotification.AssignUserGroupId)).OrderBy(x => x.UserInfoUserId).ToList();
                        if (userHierarchy != null && userHierarchy.Count > 0)
                        {
                            MLUserHierarchy individualUser = null;

                            individualUser = userHierarchy.FirstOrDefault(x => x.UserInfoUserId > lmsStageNotification.LastAssignUserInfoUserId);

                            if (individualUser != null && individualUser.UserInfoUserId > 0 && individualUser.UserInfoUserId != mLContact.UserInfoUserId)
                            {
                                using (var objUpdateLastAssinged = DLLmsStageNotification.GetDLLmsStageNotification(AdsId, SqlProvider))
                                {
                                    if (await objUpdateLastAssinged.UpdateLastAssignedUserId(lmsStageNotification.LmsStageId, individualUser.UserInfoUserId))
                                    {
                                        UserAssigned = individualUser.FirstName;
                                        return await Assign(AdsId, mLContact.ContactId, individualUser.UserInfoUserId, mLContact, true, true, true, SqlProvider);
                                    }
                                }
                            }
                            else
                            {
                                individualUser = userHierarchy.First();
                                if (individualUser != null && individualUser.UserInfoUserId > 0 && individualUser.UserInfoUserId != mLContact.UserInfoUserId)
                                {
                                    using (var objUpdateLastAssinged = DLLmsStageNotification.GetDLLmsStageNotification(AdsId, SqlProvider))
                                    {
                                        if (await objUpdateLastAssinged.UpdateLastAssignedUserId(lmsStageNotification.LmsStageId, individualUser.UserInfoUserId))
                                        {
                                            UserAssigned = individualUser.FirstName;
                                            return await Assign(AdsId, mLContact.ContactId, individualUser.UserInfoUserId, mLContact, true, true, true, LmsGroupName, SqlProvider);
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
            return true;
        }

        private async Task<bool> Assign(int AdsId, int ContactId, int UserInfoUserId, MLContact mLContact, bool Mail = false, bool Sms = false, bool WhatsApp = false, string LmsGroupName = null, string SqlVendor = null)
        {
            LeadAssignmentAgentNotification? leadAssignmentAgentNotification = new LeadAssignmentAgentNotification();

            using (var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlVendor))
            {
                leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();
            }
            bool UpdatedStatus = false;
            using (var objDL = DLContact.GetContactDetails(AdsId, SqlVendor))
            {
                UpdatedStatus = await objDL.AssignSalesPerson(ContactId, UserInfoUserId, mLContact.LmsGroupmemberId);
            }

            UserInfo? userInfo = null;

            using (var objUserInfo = DLUserInfo.GetDLUserInfo(SqlVendor))
            {
                userInfo = await objUserInfo.GetDetail(UserInfoUserId);
            }

            AssignedUserInfoUserId = userInfo.UserId;

            if (UpdatedStatus && !IsBulkAssignment)
            {
                List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();
                MailConfiguration? mailconfiguration = new MailConfiguration();
                SmsConfiguration? smsConfiguration = new SmsConfiguration();

                using var objcontactFields = DLContactExtraField.GetDLContactExtraField(AdsId, SqlVendor);
                contactExtraFields = await objcontactFields.GetList();

                using (var objDLContact = DLContact.GetContactDetails(AdsId, SqlVendor))
                {
                    mLContact = await objDLContact.GetLeadsWithContact(mLContact.ContactId, mLContact.LmsGroupmemberId);
                }

                if (Mail)
                {
                    //here we are using transactions mail for sending mail
                    using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(AdsId, SqlVendor))
                    {
                        mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                    }

                    string FromEmailId = "";
                    string? FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
                    using (var objDLSending = DLMailConfigForSending.GetDLMailConfigForSending(AdsId, SqlVendor))
                    {
                        MailConfigForSending? mailConfig = await objDLSending.GetActiveFromEmailId();
                        if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                            FromEmailId = mailConfig.FromEmailId;
                    }

                    if ((mailconfiguration != null && mailconfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Mail) && !string.IsNullOrWhiteSpace(FromEmailId))
                    {
                        try
                        {
                            string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\PlumbAlert.htm";
                            string MailBody = "";
                            if (System.IO.File.Exists(filePath))
                            {
                                using (StreamReader rd = new StreamReader(filePath))
                                {
                                    MailBody = rd.ReadToEnd();
                                    rd.Close();
                                }

                                StringBuilder ContactDetails = new StringBuilder("Lead Contact details of source " + LmsGroupName + " are <br /> ");

                                if (mLContact != null && mLContact.ContactId > 0)
                                {
                                    if (!String.IsNullOrEmpty(mLContact.Name) && mLContact.Name != "")
                                        ContactDetails.Append("<br /> Name : " + mLContact.Name + "");

                                    if (!String.IsNullOrEmpty(mLContact.EmailId) && mLContact.EmailId != "")
                                        ContactDetails.Append("<br /> EmailId : " + mLContact.EmailId + "");

                                    if (!String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "")
                                        ContactDetails.Append("<br /> PhoneNumber : " + mLContact.PhoneNumber + "");

                                    int k = 1;
                                    foreach (PropertyInfo pi in mLContact.GetType().GetProperties())
                                    {
                                        if (pi.Name != "Id" && pi.Name != "UserInfoUserId" && pi.Name != "ContactId" && pi.Name != "UserGroupId" && pi.Name != "LmsGroupId" && pi.Name != "ReminderDate" && pi.Name != "ToReminderPhoneNumber" && pi.Name != "ToReminderEmailId" && pi.Name != "Score" && pi.Name != "LastModifyByUserId" && pi.Name != "LmsGroupName" && pi.Name != "IsAdSenseOrAdWord" && pi.Name != "AccountId" && pi.Name != "Notes" && pi.Name != "Name" && pi.Name != "EmailId" && pi.Name != "PhoneNumber" && pi.Name != "MailTemplateId" && pi.Name != "SMSTemplateId" && pi.Name != "SmsAlertScheduleDate" && pi.Name != "IsNewLead" && pi.Name != "FollowUpContent" && pi.Name != "FollowUpStatus" && pi.Name != "FollowUpDate" && pi.Name != "FollowUpUserId" && pi.Name != "FollowUpUpdatedDate" && pi.Name != "CreatedUserInfoUserId" && pi.Name != "LmsGroupmemberId")
                                        {
                                            if (pi.Name == "Field" + k && contactExtraFields != null && contactExtraFields.Count > 0)
                                            {
                                                if (pi.GetValue(mLContact) != null)
                                                {
                                                    ContactDetails.Append("<br />" + contactExtraFields[k - 1].FieldName + " : " + pi.GetValue(mLContact, null).ToString());
                                                }
                                                k++;
                                            }
                                            else
                                            {
                                                if (pi.GetValue(mLContact) != null)
                                                    ContactDetails.Append("<br />" + pi.Name + " : " + pi.GetValue(mLContact, null).ToString());
                                            }
                                        }
                                    }

                                    MailBody = MailBody.Replace("<!--$$$$$1-->", ContactDetails.ToString()).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                                    MailSetting mailSetting = new MailSetting()
                                    {
                                        Forward = false,
                                        FromEmailId = FromEmailId,
                                        FromName = FromName,
                                        MailTemplateId = 0,
                                        ReplyTo = FromEmailId,
                                        Subject = "Lead has been assigned to you",
                                        Subscribe = true,
                                        MessageBodyText = MailBody,
                                        IsTransaction = false
                                    };

                                    MLMailSent mailSent = new MLMailSent()
                                    {
                                        MailCampaignId = 0,
                                        MailSendingSettingId = 0,
                                        GroupId = 0,
                                        ContactId = mLContact.ContactId,
                                        EmailId = userInfo.EmailId,
                                        P5MailUniqueID = Guid.NewGuid().ToString()
                                    };

                                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                                    {
                                        ConfigurationId = 0,
                                        GroupId = 0
                                    };

                                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(AdsId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "LMS");
                                    bool SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                                    if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                                    {
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
                                            ContactId = 0,
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
                                            MailConfigurationNameId = mailconfiguration.MailConfigurationNameId,
                                            UserInfoUserId = userInfo.UserId
                                        };

                                        using (var objDL = DLMailSent.GetDLMailSent(AdsId, SqlVendor))
                                        {
                                            await objDL.Send(responseMailSent);
                                        }
                                    }
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                }

                if (Sms)
                {
                    using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(AdsId, SqlVendor))
                    {
                        smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                    }
                    #region DLT Notification SMS
                    SmsNotificationTemplate? smsNotificationTemplate;
                    using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(AdsId, SqlVendor))
                    {

                        smsNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");
                    }
                    #endregion DLT Notification SMS
                    if ((smsConfiguration != null && smsConfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Sms) && smsNotificationTemplate.IsSmsNotificationEnabled)
                    {
                        try
                        {
                            if (userInfo != null && !String.IsNullOrEmpty(userInfo.MobilePhone))
                            {
                                if (mLContact != null && mLContact.ContactId > 0)
                                {
                                    string LeadAssignMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                     .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                     .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                     .Replace("[{*LmsGroupName*}]", LmsGroupName);

                                    string MessageContent = System.Web.HttpUtility.HtmlDecode(LeadAssignMessageContent);

                                    SmsSent smsSent = new SmsSent()
                                    {
                                        CampaignJobName = "campaign",
                                        ContactId = 0,
                                        GroupId = 0,
                                        MessageContent = MessageContent,
                                        PhoneNumber = userInfo.MobilePhone,
                                        SmsSendingSettingId = 0,
                                        SmsTemplateId = 0,
                                        VendorName = smsConfiguration.ProviderName,
                                        IsUnicodeMessage = false,
                                        VendorTemplateId = smsNotificationTemplate.VendorTemplateId
                                    };

                                    IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, SqlVendor, "campaign");
                                    bool SmsSentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);
                                    string SmsErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                                    if (SmsSentStatus)
                                    {
                                        Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                        smsSent.SentDate = DateTime.Now;
                                        smsSent.IsDelivered = 0;
                                        smsSent.IsClicked = 0;
                                        smsSent.Operator = null;
                                        smsSent.Circle = null;
                                        smsSent.DeliveryTime = null;
                                        smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;
                                        smsSent.ContactId = 0;
                                        smsSent.UserInfoUserId = userInfo.UserId;
                                        using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlVendor))
                                        {
                                            await objDLSMS.Save(smsSent);
                                        }
                                    }
                                    else
                                    {
                                        Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                        smsSent.SentDate = DateTime.Now;
                                        smsSent.IsDelivered = 0;
                                        smsSent.IsClicked = 0;
                                        smsSent.Operator = null;
                                        smsSent.Circle = null;
                                        smsSent.ContactId = 0;
                                        smsSent.DeliveryTime = null;
                                        smsSent.SendStatus = 0;
                                        smsSent.ReasonForNotDelivery = SmsErrorMessage;
                                        smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;
                                        smsSent.UserInfoUserId = userInfo.UserId;

                                        using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlVendor))
                                        {
                                            await objDLSMS.Save(smsSent);
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                }

                if (WhatsApp)
                {
                    WhatsAppConfiguration? whatsappConfiguration = new WhatsAppConfiguration();

                    using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(AdsId, SqlVendor))
                        whatsappConfiguration = await objBL.GetConfigurationDetailsForSending(IsDefaultProvider: true);

                    #region Notification WhatsApp
                    WhatsAppNotificationTemplate? whatsappNotificationTemplate;

                    using (var obj = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(AdsId, SqlVendor))
                        whatsappNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");

                    #endregion Notification WhatsApp

                    if ((whatsappConfiguration != null && whatsappConfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.WhatsApp) && whatsappNotificationTemplate.IsWhatsAppNotificationEnabled)
                    {
                        try
                        {
                            if (userInfo != null && !String.IsNullOrEmpty(userInfo.MobilePhone))
                            {
                                if (mLContact != null && mLContact.ContactId > 0)
                                {
                                    bool SentStatus = false;
                                    string UserAttributeMessageDetails = "";
                                    string UserButtonOneDynamicURLDetails = "";
                                    string UserButtonTwoDynamicURLDetails = "";
                                    string MediaURLDetails = "";
                                    string langcode = "";
                                    WhatsappSent watsAppSent = new WhatsappSent();

                                    HelperForSMS HelpSMS = new HelperForSMS(AdsId, SqlVendor);
                                    StringBuilder UserButtonOneBodydata = new StringBuilder();
                                    StringBuilder UserButtonTwoBodydata = new StringBuilder();
                                    StringBuilder MediaUrlBodyData = new StringBuilder();

                                    if (!string.IsNullOrEmpty(whatsappNotificationTemplate.UserAttributes))
                                    {
                                        UserAttributeMessageDetails = whatsappNotificationTemplate.UserAttributes.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                     .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                     .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                     .Replace("[{*LmsGroupName*}]", LmsGroupName);

                                        whatsappNotificationTemplate.TemplateContent = whatsappNotificationTemplate.TemplateContent.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                     .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                     .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                     .Replace("[{*LmsGroupName*}]", LmsGroupName);

                                        if (!string.IsNullOrEmpty(UserAttributeMessageDetails))
                                            UserAttributeMessageDetails = UserAttributeMessageDetails.Replace(",", "$@$");
                                    }

                                    if (!string.IsNullOrEmpty(whatsappNotificationTemplate.TemplateLanguage))
                                    {
                                        if (whatsappNotificationTemplate.TemplateLanguage == "English")
                                            langcode = "en";
                                    }

                                    string PhoneNumber = userInfo.MobilePhone;

                                    if (Helper.IsValidPhoneNumber(ref PhoneNumber))
                                    {
                                        if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                                        {
                                            WhatsappSent watsappsent = new WhatsappSent()
                                            {
                                                MediaFileURL = MediaURLDetails,
                                                PhoneNumber = PhoneNumber,
                                                UserAttributes = UserAttributeMessageDetails,
                                                ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                CampaignJobName = "campaign",
                                                ContactId = 0,
                                                GroupId = 0,
                                                MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                WhatsappSendingSettingId = 0,
                                                WhatsappTemplateId = 0,
                                                VendorName = whatsappConfiguration.ProviderName,
                                                SentDate = DateTime.Now,
                                                IsDelivered = 0,
                                                IsClicked = 0,
                                                ErrorMessage = "User Attributes dynamic content not replaced",
                                                SendStatus = 0,
                                                WorkFlowDataId = 0,
                                                WorkFlowId = 0,
                                                IsFailed = 1,
                                                WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                            };

                                            using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                await objBL.Save(watsappsent);
                                        }
                                        else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                                        {
                                            WhatsappSent watsappsent = new WhatsappSent()
                                            {
                                                MediaFileURL = MediaURLDetails,
                                                PhoneNumber = PhoneNumber,
                                                UserAttributes = UserAttributeMessageDetails,
                                                ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                CampaignJobName = "campaign",
                                                ContactId = 0,
                                                GroupId = 0,
                                                MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                WhatsappSendingSettingId = 0,
                                                WhatsappTemplateId = 0,
                                                VendorName = whatsappConfiguration.ProviderName,
                                                SentDate = DateTime.Now,
                                                IsDelivered = 0,
                                                IsClicked = 0,
                                                ErrorMessage = "Template button one dynamic url content not replaced",
                                                SendStatus = 0,
                                                WorkFlowDataId = 0,
                                                WorkFlowId = 0,
                                                IsFailed = 1,
                                                WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                            };

                                            using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                await objBL.Save(watsappsent);
                                        }
                                        else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                                        {
                                            WhatsappSent watsappsent = new WhatsappSent()
                                            {
                                                MediaFileURL = MediaURLDetails,
                                                PhoneNumber = PhoneNumber,
                                                UserAttributes = UserAttributeMessageDetails,
                                                ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                CampaignJobName = "campaign",
                                                ContactId = 0,
                                                GroupId = 0,
                                                MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                WhatsappSendingSettingId = 0,
                                                WhatsappTemplateId = 0,
                                                VendorName = whatsappConfiguration.ProviderName,
                                                SentDate = DateTime.Now,
                                                IsDelivered = 0,
                                                IsClicked = 0,
                                                ErrorMessage = "Template button two dynamic url content not replaced",
                                                SendStatus = 0,
                                                WorkFlowDataId = 0,
                                                WorkFlowId = 0,
                                                IsFailed = 1,
                                                WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                            };

                                            using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                await objBL.Save(watsappsent);
                                        }
                                        else
                                        {
                                            List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                                            MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                                            {
                                                MediaFileURL = MediaURLDetails,
                                                CountryCode = whatsappConfiguration.CountryCode,
                                                PhoneNumber = PhoneNumber,
                                                WhiteListedTemplateName = whatsappNotificationTemplate.WhiteListedTemplateName,
                                                LanguageCode = langcode,
                                                UserAttributes = UserAttributeMessageDetails,
                                                ButtonOneText = whatsappNotificationTemplate.ButtonOneText,
                                                ButtonTwoText = whatsappNotificationTemplate.ButtonTwoText,
                                                ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                CampaignJobName = "campaign",
                                                ContactId = 0,
                                                GroupId = 0,
                                                MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                WhatsappSendingSettingId = 0,
                                                WhatsappTemplateId = 0,
                                                VendorName = whatsappConfiguration.ProviderName
                                            };
                                            whatsappSentList.Add(mlwatsappsent);

                                            IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(AdsId, whatsappConfiguration, "campaign");
                                            SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                                            string ErrorMessage = WhatsAppGeneralBaseFactory.ErrorMessage;

                                            if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                                            {
                                                Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);
                                                watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;

                                                using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                    await objBL.Save(watsAppSent);
                                            }
                                            else if (!SentStatus && !string.IsNullOrEmpty(ErrorMessage))
                                            {
                                                Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);
                                                watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;

                                                using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                    await objBL.Save(watsAppSent);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                    else
                    {
                        ErrorUpdation.AddErrorLog("Plumb5GenralFunction", "Please check WhatsApp Configuration Settings", "Unable to send stage alert WhatsApp as WhatsApp configuration settings is not done", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->WhatsApp", "WhatsApp Cannot be sent");
                    }
                }
            }
            else
            {
                BulkUserInfoUserIds.Add(UserInfoUserId.ToString());
                BulkUserInfoUserName.Add(userInfo.FirstName);
            }
            return UpdatedStatus;
        }
        public async void Mail(List<string> EmailIds, UserInfo objuser, List<string> stages, int AdsId, string leadEmailId, string LmsGroupName, string SqlProvider)
        {
            MailConfiguration mailconfiguration = new MailConfiguration();
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = new LeadAssignmentAgentNotification();

            using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(AdsId, SqlProvider))
            {
                mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            string FromEmailId = "";
            string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(AdsId, SqlProvider))
            {
                MailConfigForSending mailConfig = await objDL.GetActiveFromEmailId();
                if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                    FromEmailId = mailConfig.FromEmailId;
            }

            using (var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlProvider))
            {
                leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();
            }

            try
            {
                if ((mailconfiguration != null && mailconfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Mail) && !string.IsNullOrWhiteSpace(FromEmailId))
                {
                    try
                    {
                        string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\LmsStageUpdateNoti.html";

                        string MailBody = "";

                        if (System.IO.File.Exists(filePath))
                        {
                            using (StreamReader rd = new StreamReader(filePath))
                            {
                                MailBody = rd.ReadToEnd();
                                rd.Close();
                            }

                            MailBody = MailBody.Replace("<!--FromStage-->", stages[0]).Replace("<!--Source-->", LmsGroupName).Replace("<!--ToStage-->", stages[1]).Replace("<!--LeadEmailId-->", leadEmailId).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                            for (int a = 0; a < EmailIds.Count(); a++)
                            {
                                if (Helper.IsValidEmailAddress(EmailIds[a].Trim()))
                                {
                                    MailSetting mailSetting = new MailSetting()
                                    {
                                        Forward = false,
                                        FromEmailId = FromEmailId,
                                        FromName = FromName,
                                        MailTemplateId = 0,
                                        ReplyTo = FromEmailId,
                                        Subject = "Lead Stage Change Alert",
                                        Subscribe = true,
                                        MessageBodyText = MailBody,
                                        IsTransaction = false
                                    };

                                    MLMailSent mailSent = new MLMailSent()
                                    {
                                        MailCampaignId = 0,
                                        MailSendingSettingId = 0,
                                        GroupId = 0,
                                        ContactId = 0,
                                        EmailId = EmailIds[a],
                                        P5MailUniqueID = Guid.NewGuid().ToString()
                                    };

                                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                                    {
                                        ConfigurationId = 0,
                                        GroupId = 0
                                    };

                                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(AdsId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "LMS");
                                    bool SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                                    if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                                    {
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
                                            MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                        };

                                        using (var objDL = DLMailSent.GetDLMailSent(AdsId, SqlProvider))
                                        {
                                            await objDL.Send(responseMailSent);
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            ErrorUpdation.AddErrorLog("Plumb5GenralFunction", "Lead stage change alert", "Lead stage alert template not exists", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail", "Mail Cannot be sent");
                        }
                    }
                    catch (Exception ex)
                    {
                        ErrorUpdation.AddErrorLog("Plumb5GenralFunction_Inner", ex.Message.ToString(), "Lead Alert Stage Change Mail exception in Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail Inner method", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail Inner method", ex.ToString());
                    }
                }
                else
                {
                    ErrorUpdation.AddErrorLog("Plumb5GenralFunction", "Please check Mail Configuration Settings", "Unable to send stage alert mail as mail configuration settings is not done", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail", "Mail Cannot be sent");
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("Plumb5GenralFunction", ex.Message.ToString(), "Lead Alert Stage Change Mail exception in Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail method", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->Mail method", ex.ToString());
            }
        }

        public async void SMS(List<string> PhoneNumbers, UserInfo objuser, List<string> stages, int AdsId, string leadEmailId, string LmsGroupName, string SqlProvider)
        {
            SmsConfiguration smsConfiguration = new SmsConfiguration();
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = new LeadAssignmentAgentNotification();

            using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(AdsId, SqlProvider))
            {
                smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            using (var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlProvider))
            {
                leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();
            }
            #region DLT Notification SMS
            SmsNotificationTemplate smsNotificationTemplate;
            using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(AdsId, SqlProvider))
            {

                smsNotificationTemplate = await obj.GetByIdentifier("lmsstagechange");
            }
            #endregion DLT Notification SMS

            try
            {
                if ((smsConfiguration != null && smsConfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Sms && smsNotificationTemplate.IsSmsNotificationEnabled))
                {
                    // var messagestring = "From Plumb5 : Lead (" + leadEmailId + "), Stage has been updated to " + stages[1] + " from " + stages[0] + " By " + objuser.FirstName;

                    string LeadStageChangeMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*LeadEmailId*}]", leadEmailId)
                                                       .Replace("[{*NewStage*}]", stages[1]).Replace("[{*PreviousStage*}]", stages[0])
                                                       .Replace("[{*UserName*}]", objuser.FirstName)
                                                       .Replace("[{*LmsGroupName*}]", LmsGroupName);

                    for (int a = 0; a < PhoneNumbers.Count(); a++)
                    {
                        string PhoneNumber = PhoneNumbers[a];

                        if (Helper.IsValidPhoneNumber(ref PhoneNumber))
                        {
                            //#region Logs 
                            //string SMSLogMessage = string.Empty;
                            //Int64 SMSLogId = TrackLogs.SaveLog(AdsId, 0, "", "", "Plumb5GenralFunction", "LmsUpdateStageNotification", "SMS", "", JsonConvert.SerializeObject(new { PhoneNumbers = PhoneNumbers[a] }));
                            //#endregion

                            SmsSent smsSent = new SmsSent()
                            {
                                CampaignJobName = "campaign",
                                ContactId = 0,
                                GroupId = 0,
                                MessageContent = LeadStageChangeMessageContent,
                                PhoneNumber = PhoneNumber,
                                SmsSendingSettingId = 0,
                                SmsTemplateId = 0,
                                VendorName = smsConfiguration.ProviderName,
                                IsUnicodeMessage = false,
                                VendorTemplateId = smsNotificationTemplate.VendorTemplateId
                            };

                            IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, "campaign", SqlProvider);
                            bool SmsSentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);
                            string SmsErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                            Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                            if (SmsSentStatus)
                            {
                                smsSent.SentDate = DateTime.Now;
                                smsSent.IsDelivered = 0;
                                smsSent.IsClicked = 0;
                                smsSent.Operator = null;
                                smsSent.Circle = null;
                                smsSent.DeliveryTime = null;
                                smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;

                                using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlProvider))
                                {
                                    await objDLSMS.Save(smsSent);
                                }

                                //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = true, Message = "Lead Stage Change Alert SMS has been sent" }), "Lead Stage Change Alert SMS has been sent");
                            }
                            else
                            {
                                smsSent.SentDate = DateTime.Now;
                                smsSent.IsDelivered = 0;
                                smsSent.IsClicked = 0;
                                smsSent.Operator = null;
                                smsSent.Circle = null;
                                smsSent.DeliveryTime = null;
                                smsSent.ReasonForNotDelivery = SmsErrorMessage;
                                smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;

                                using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlProvider))
                                {
                                    await objDLSMS.Save(smsSent);
                                }

                                //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = false, Message = SmsErrorMessage }), "Unable to send Lead Stage Change Alert sms");
                            }
                        }
                    }
                }
                else
                {
                    ErrorUpdation.AddErrorLog("Plumb5GenralFunction", "Please check SMS Configuration Settings", "Unable to send stage alert sms as SMS configuration settings is not done", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->SMS", "SMS Cannot be sent");
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("Plumb5GenralFunction", ex.Message.ToString(), "Lead Alert Stage Change SMS exception in Plumb5GenralFunction-->LmsUpdateStageNotification-->SMS method", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->SMS method", ex.ToString());
            }
        }

        public async void WhatsApp(List<string> PhoneNumbers, UserInfo objuser, List<string> stages, int AdsId, string leadEmailId, string LmsGroupName, string SqlProvider)
        {
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = new LeadAssignmentAgentNotification();
            WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();

            using (var objDL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(AdsId, SqlProvider))
            {
                whatsappConfiguration = await objDL.GetConfigurationDetailsForSending(IsDefaultProvider: true);
            }

            using (var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlProvider))
            {
                leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();
            }

            #region Notification WhatsApp
            WhatsAppNotificationTemplate whatsappNotificationTemplate;
            using (var obj = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(AdsId, SqlProvider))
            {
                whatsappNotificationTemplate = await obj.GetByIdentifier("lmsstagechange");
            }
            #endregion Notification WhatsApp

            try
            {
                if (whatsappConfiguration != null && whatsappConfiguration.Id > 0 && whatsappNotificationTemplate != null && whatsappNotificationTemplate.IsWhatsAppNotificationEnabled)
                {
                    bool SentStatus = false;
                    string UserAttributeMessageDetails = "";
                    string UserButtonOneDynamicURLDetails = "";
                    string UserButtonTwoDynamicURLDetails = "";
                    string MediaURLDetails = "";
                    string langcode = "";
                    WhatsappSent watsAppSent = new WhatsappSent();

                    HelperForSMS HelpSMS = new HelperForSMS(AdsId, SqlProvider);
                    StringBuilder UserButtonOneBodydata = new StringBuilder();
                    StringBuilder UserButtonTwoBodydata = new StringBuilder();
                    StringBuilder MediaUrlBodyData = new StringBuilder();

                    if (!string.IsNullOrEmpty(whatsappNotificationTemplate.UserAttributes))
                    {
                        UserAttributeMessageDetails = whatsappNotificationTemplate.UserAttributes.Replace("[{*LeadEmailId*}]", string.IsNullOrEmpty(leadEmailId) ? "NA" : leadEmailId)
                                                       .Replace("[{*NewStage*}]", stages[1]).Replace("[{*PreviousStage*}]", string.IsNullOrEmpty(stages[0]) ? "NA" : stages[0])
                                                       .Replace("[{*UserName*}]", string.IsNullOrEmpty(objuser.FirstName) ? "NA" : objuser.FirstName)
                                                       .Replace("[{*LmsGroupName*}]", string.IsNullOrEmpty(LmsGroupName) ? "NA" : LmsGroupName);

                        whatsappNotificationTemplate.TemplateContent = whatsappNotificationTemplate.TemplateContent.Replace("[{*LeadEmailId*}]", string.IsNullOrEmpty(leadEmailId) ? "NA" : leadEmailId)
                                                       .Replace("[{*NewStage*}]", stages[1]).Replace("[{*PreviousStage*}]", string.IsNullOrEmpty(stages[0]) ? "NA" : stages[0])
                                                       .Replace("[{*UserName*}]", string.IsNullOrEmpty(objuser.FirstName) ? "NA" : objuser.FirstName)
                                                       .Replace("[{*LmsGroupName*}]", string.IsNullOrEmpty(LmsGroupName) ? "NA" : LmsGroupName);

                        if (!string.IsNullOrEmpty(UserAttributeMessageDetails))
                            UserAttributeMessageDetails = UserAttributeMessageDetails.Replace(",", "$@$");
                    }

                    if (!string.IsNullOrEmpty(whatsappNotificationTemplate.TemplateLanguage))
                    {
                        if (whatsappNotificationTemplate.TemplateLanguage == "English")
                            langcode = "en";
                    }


                    for (int a = 0; a < PhoneNumbers.Count(); a++)
                    {
                        string PhoneNumber = PhoneNumbers[a];

                        if (Helper.IsValidPhoneNumber(ref PhoneNumber))
                        {
                            if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                            {
                                WhatsappSent watsappsent = new WhatsappSent()
                                {
                                    MediaFileURL = MediaURLDetails,
                                    PhoneNumber = PhoneNumber,
                                    UserAttributes = UserAttributeMessageDetails,
                                    ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                    ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                    CampaignJobName = "lms",
                                    ContactId = 0,
                                    GroupId = 0,
                                    MessageContent = whatsappNotificationTemplate.TemplateContent,
                                    WhatsappSendingSettingId = 0,
                                    WhatsappTemplateId = 0,
                                    VendorName = whatsappConfiguration.ProviderName,
                                    SentDate = DateTime.Now,
                                    IsDelivered = 0,
                                    IsClicked = 0,
                                    ErrorMessage = "User Attributes dynamic content not replaced",
                                    SendStatus = 0,
                                    WorkFlowDataId = 0,
                                    WorkFlowId = 0,
                                    IsFailed = 1,
                                    WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                };

                                using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlProvider))
                                {
                                    await objBL.Save(watsappsent);
                                }
                            }
                            else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                            {
                                WhatsappSent watsappsent = new WhatsappSent()
                                {
                                    MediaFileURL = MediaURLDetails,
                                    PhoneNumber = PhoneNumber,
                                    UserAttributes = UserAttributeMessageDetails,
                                    ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                    ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                    CampaignJobName = "lms",
                                    ContactId = 0,
                                    GroupId = 0,
                                    MessageContent = whatsappNotificationTemplate.TemplateContent,
                                    WhatsappSendingSettingId = 0,
                                    WhatsappTemplateId = 0,
                                    VendorName = whatsappConfiguration.ProviderName,
                                    SentDate = DateTime.Now,
                                    IsDelivered = 0,
                                    IsClicked = 0,
                                    ErrorMessage = "Template button one dynamic url content not replaced",
                                    SendStatus = 0,
                                    WorkFlowDataId = 0,
                                    WorkFlowId = 0,
                                    IsFailed = 1,
                                    WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                };

                                using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlProvider))
                                {
                                    await objBL.Save(watsappsent);
                                }
                            }
                            else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                            {
                                WhatsappSent watsappsent = new WhatsappSent()
                                {
                                    MediaFileURL = MediaURLDetails,
                                    PhoneNumber = PhoneNumber,
                                    UserAttributes = UserAttributeMessageDetails,
                                    ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                    ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                    CampaignJobName = "lms",
                                    ContactId = 0,
                                    GroupId = 0,
                                    MessageContent = whatsappNotificationTemplate.TemplateContent,
                                    WhatsappSendingSettingId = 0,
                                    WhatsappTemplateId = 0,
                                    VendorName = whatsappConfiguration.ProviderName,
                                    SentDate = DateTime.Now,
                                    IsDelivered = 0,
                                    IsClicked = 0,
                                    ErrorMessage = "Template button two dynamic url content not replaced",
                                    SendStatus = 0,
                                    WorkFlowDataId = 0,
                                    WorkFlowId = 0,
                                    IsFailed = 1,
                                    WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                };

                                using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlProvider))
                                {
                                    await objBL.Save(watsappsent);
                                }
                            }
                            else
                            {
                                List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                                MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                                {
                                    MediaFileURL = MediaURLDetails,
                                    CountryCode = whatsappConfiguration.CountryCode,
                                    PhoneNumber = PhoneNumber,
                                    WhiteListedTemplateName = whatsappNotificationTemplate.WhiteListedTemplateName,
                                    LanguageCode = langcode,
                                    UserAttributes = UserAttributeMessageDetails,
                                    ButtonOneText = whatsappNotificationTemplate.ButtonOneText,
                                    ButtonTwoText = whatsappNotificationTemplate.ButtonTwoText,
                                    ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                    ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                    CampaignJobName = "lms",
                                    ContactId = 0,
                                    GroupId = 0,
                                    MessageContent = whatsappNotificationTemplate.TemplateContent,
                                    WhatsappSendingSettingId = 0,
                                    WhatsappTemplateId = 0,
                                    VendorName = whatsappConfiguration.ProviderName
                                };
                                whatsappSentList.Add(mlwatsappsent);

                                IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(AdsId, whatsappConfiguration, "lms");
                                SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                                string ErrorMessage = WhatsAppGeneralBaseFactory.ErrorMessage;

                                if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                                {
                                    Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);
                                    watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;
                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlProvider))
                                    {
                                        await objBL.Save(watsAppSent);
                                    }
                                }
                                else if (!SentStatus && !string.IsNullOrEmpty(ErrorMessage))
                                {
                                    Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);
                                    watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;
                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlProvider))
                                    {
                                        await objBL.Save(watsAppSent);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    ErrorUpdation.AddErrorLog("Plumb5GenralFunction", "Please check WhatsApp Configuration Settings", "Unable to send stage alert WhatsApp as WhatsApp configuration settings is not done", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->WhatsApp", "WhatsApp Cannot be sent");
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("Plumb5GenralFunction", ex.Message.ToString(), "Lead Alert Stage Change SMS exception in Plumb5GenralFunction-->LmsUpdateStageNotification-->SMS method", DateTime.Now, "Plumb5GenralFunction-->LmsUpdateStageNotification-->SMS method", ex.ToString());
            }
        }

        public async void SendWhatsAappToLead(int accountId, int WhatsAppTemplateId, string PhoneNumber, int WhatsAppConfigurationNameId, string SqlProvider)
        {
            WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();
            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";
            string UserAttributeMessageDetails = "";
            string UserButtonOneDynamicURLDetails = "";
            string UserButtonTwoDynamicURLDetails = "";
            string MediaURLDetails = "";
            string langcode = "";
            WhatsappSent watsAppSent = new WhatsappSent();
            string P5WhatsappUniqueID = Guid.NewGuid().ToString();
            List<WhatsAppTemplateUrl> whatsappUrlList = new List<WhatsAppTemplateUrl>();

            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(accountId, SqlProvider))
            {
                whatsappConfiguration = await objBL.GetConfigurationDetailsForSending(IsDefaultProvider: true);
            }
            if (whatsappConfiguration != null && whatsappConfiguration.Id > 0)
            {
                Contact contactDetails = new Contact() { PhoneNumber = PhoneNumber };

                using (var objDL = DLContact.GetContactDetails(accountId, SqlProvider))
                {
                    contactDetails = await objDL.GetDetails(contactDetails, null, true);
                }

                if (contactDetails == null)
                    contactDetails = new Contact() { PhoneNumber = PhoneNumber, CountryCode = whatsappConfiguration.CountryCode };

                if (contactDetails != null && string.IsNullOrEmpty(contactDetails.CountryCode))
                    contactDetails.CountryCode = whatsappConfiguration.CountryCode;

                WhatsAppTemplates whatsapptemplateDetails;

                using (var objDLTemplate = DLWhatsAppTemplates.GetDLWhatsAppTemplates(accountId, SqlProvider))
                {
                    whatsapptemplateDetails = await objDLTemplate.GetSingle(WhatsAppTemplateId);
                }

                using (var objsmstempUrl = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(accountId, SqlProvider))
                {
                    whatsappUrlList = await objsmstempUrl.GetDetail(WhatsAppTemplateId);
                }

                if (whatsapptemplateDetails != null)
                {
                    WhatsAppLanguageCodes whatsapplanguagecodes;

                    using (var objDLTemplate = DLWhatsAppLanguageCodes.GetDLWhatsAppLanguageCodes(accountId, SqlProvider))
                    {
                        whatsapplanguagecodes = await objDLTemplate.GetWhatsAppShortenLanguageCode(whatsappConfiguration.ProviderName, whatsapptemplateDetails.TemplateLanguage);
                    }

                    UserAttributeMessageDetails = "";
                    UserButtonOneDynamicURLDetails = "";
                    UserButtonTwoDynamicURLDetails = "";

                    HelperForSMS HelpSMS = new HelperForSMS(accountId, SqlProvider);
                    HelperForWhatsApp HelpWhatsApp = new HelperForWhatsApp(accountId, SqlProvider);
                    StringBuilder UserAttrBodydata = new StringBuilder();
                    StringBuilder UserButtonOneBodydata = new StringBuilder();
                    StringBuilder UserButtonTwoBodydata = new StringBuilder();
                    StringBuilder MediaUrlBodyData = new StringBuilder();

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.UserAttributes))
                    {
                        UserAttrBodydata.Append(whatsapptemplateDetails.UserAttributes);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserAttrBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0, true);
                        //HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                        UserAttributeMessageDetails = UserAttrBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonOneDynamicURLSuffix))
                    {
                        UserButtonOneBodydata.Append(whatsapptemplateDetails.ButtonOneDynamicURLSuffix);

                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(accountId, SqlProvider);
                        helpconvert.GenerateShortenLinkByUrl(UserButtonOneBodydata, contactDetails, Convert.ToInt32(WhatsAppTemplateId), 0, P5WhatsappUniqueID);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonOneBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0);
                        HelpSMS.ReplaceContactDetails(UserButtonOneBodydata, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        UserButtonOneDynamicURLDetails = UserButtonOneBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix))
                    {
                        UserButtonTwoBodydata.Append(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix);
                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(accountId, SqlProvider);
                        helpconvert.GenerateShortenLinkByUrl(UserButtonTwoBodydata, contactDetails, Convert.ToInt32(WhatsAppTemplateId), 0, P5WhatsappUniqueID);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonTwoBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID);
                        HelpSMS.ReplaceContactDetails(UserButtonTwoBodydata, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        UserButtonTwoDynamicURLDetails = UserButtonTwoBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.MediaFileURL))
                    {
                        MediaUrlBodyData.Append(whatsapptemplateDetails.MediaFileURL);
                        //HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails);
                        HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                        MediaURLDetails = MediaUrlBodyData.ToString();
                    }

                    if (whatsapplanguagecodes != null && !string.IsNullOrEmpty(whatsapplanguagecodes.ShortenLanguageCode))
                        langcode = whatsapplanguagecodes.ShortenLanguageCode;

                    if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "User Attributes dynamic content not replaced";
                    }
                    else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "Template button one dynamic url content not replaced";
                    }
                    else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "Template button two dynamic url content not replaced";
                    }
                    else
                    {
                        List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                        MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                        {
                            MediaFileURL = MediaURLDetails,
                            CountryCode = contactDetails.CountryCode,
                            PhoneNumber = contactDetails.PhoneNumber,
                            WhiteListedTemplateName = whatsapptemplateDetails.WhitelistedTemplateName,
                            LanguageCode = langcode,
                            UserAttributes = UserAttributeMessageDetails,
                            ButtonOneText = whatsapptemplateDetails.ButtonOneText,
                            ButtonTwoText = whatsapptemplateDetails.ButtonTwoText,
                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                            CampaignJobName = "campaign",
                            ContactId = contactDetails.ContactId,
                            GroupId = 0,
                            MessageContent = whatsapptemplateDetails.TemplateContent,
                            WhatsappSendingSettingId = 0,
                            WhatsappTemplateId = WhatsAppTemplateId,
                            VendorName = whatsappConfiguration.ProviderName,
                            P5WhatsappUniqueID = P5WhatsappUniqueID
                        };
                        whatsappSentList.Add(mlwatsappsent);

                        IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(accountId, whatsappConfiguration, "campaign");
                        SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                        Message = WhatsAppGeneralBaseFactory.ErrorMessage;

                        if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                        {
                            ResponseId = WhatsAppGeneralBaseFactory.VendorResponses[0].ResponseId;
                            Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                            watsAppSent.UserAttributes = UserAttributeMessageDetails;
                            watsAppSent.ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails;
                            watsAppSent.ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails;
                            watsAppSent.MediaFileURL = MediaURLDetails;
                            watsAppSent.IsDelivered = 0;
                            watsAppSent.IsClicked = 0;
                            watsAppSent.P5WhatsappUniqueID = P5WhatsappUniqueID;
                            watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;

                            using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(accountId, SqlProvider))
                            {
                                await objDL.Save(watsAppSent);
                            }
                        }
                        else
                        {
                            SentStatus = false;
                            Message = "WhatsApp Message has not been sent - " + Message + "";
                        }
                    }
                }
                else
                {
                    SentStatus = false;
                    Message = "Template not found";
                }
            }
            else
            {
                SentStatus = false;
                Message = "You have not configured for WhatsApp";
            }

        }
        public async void SendSmsToLead(int accountId, int SmsTemplateId, string PhoneNumber, string SqlProvider)
        {
            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";
            SmsConfiguration smsConfiguration = new SmsConfiguration();
            UserInfo UserDetails = new UserInfo();
            string VendorTemplateId = "0";
            string MessageContent = "";
            bool? ConvertLinkToShortenUrl = null;
            List<SmsTemplateUrl> smsUrlList = new List<SmsTemplateUrl>();
            //string P5SMSUniqueID = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string P5UniqueID = Guid.NewGuid().ToString();
            using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(accountId, SqlProvider))
            {
                smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
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
                    Contact contactDetails = new Contact() { PhoneNumber = PhoneNumber };

                    using (var objDL = DLContact.GetContactDetails(accountId, SqlProvider))
                    {
                        contactDetails = await objDL.GetDetails(contactDetails, null, true);
                    }

                    if (contactDetails == null)
                    {
                        contactDetails = new Contact() { PhoneNumber = PhoneNumber };
                    }

                    if (SmsTemplateId != 0)
                    {
                        SmsTemplate smsTemplate;
                        using (var objDL = DLSmsTemplate.GetDLSmsTemplate(accountId, SqlProvider))
                        {
                            smsTemplate = await objDL.GetDetails(SmsTemplateId);
                        }

                        if (smsTemplate != null)
                        {
                            MessageContent = System.Web.HttpUtility.HtmlDecode(smsTemplate.MessageContent);
                            VendorTemplateId = smsTemplate.VendorTemplateId;
                            ConvertLinkToShortenUrl = smsTemplate.ConvertLinkToShortenUrl;
                        }
                        using (var objsmstempUrl = DLSmsTemplateUrl.GetDLSmsTemplateUrl(accountId, SqlProvider))
                        {
                            smsUrlList = (await objsmstempUrl.GetDetail(SmsTemplateId)).ToList();
                        }
                    }

                    if (MessageContent != null)
                    {
                        MessageContent = System.Web.HttpUtility.HtmlDecode(MessageContent);

                        HelperForSMS HelpSMS = new HelperForSMS(accountId, SqlProvider);
                        ConvertURLToShortenLink helpconvert = new ConvertURLToShortenLink(accountId, SqlProvider);

                        StringBuilder Bodydata = new StringBuilder();
                        Bodydata.Append(MessageContent);
                        HelpSMS.ReplaceMessageWithSMSUrl("campaign", Bodydata, 0, contactDetails.ContactId, smsUrlList, P5UniqueID);

                        //if (Convert.ToBoolean(ConvertLinkToShortenUrl))
                        //    helpconvert.GenerateShortenLinkByUrl(Bodydata, contactDetails, SmsTemplateId, 0, P5SMSUniqueID);

                        //HelpSMS.ReplaceContactDetails(Bodydata, contactDetails);
                        HelpSMS.ReplaceContactDetails(Bodydata, contactDetails, accountId, "", SmsTemplateId, 0, P5UniqueID, "sms", Convert.ToBoolean(ConvertLinkToShortenUrl));

                        //LmsGroupMembers lmsDetails = null;
                        //using (DLLmsGroupMembers objDL = new DLLmsGroupMembers(accountId))
                        //    lmsDetails = objDL.GetLmsDetails(contactid: contactDetails.ContactId);

                        //if (lmsDetails != null)
                        //{
                        //    HelpSMS.ReplaceLmsDetails(Bodydata, lmsDetails);
                        //}

                        //replace the lms custom field data
                        if ((Bodydata.ToString().Contains("[{*")) && (Bodydata.ToString().Contains("*}]")))
                            Bodydata.LmsUserInfoFieldsReplacement(accountId, 0, contactDetails.ContactId, SqlProvider);

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
                                SmsTemplateId = SmsTemplateId,
                                VendorName = smsConfiguration.ProviderName,
                                IsUnicodeMessage = IsUnicodeMessage,
                                VendorTemplateId = VendorTemplateId,
                                P5SMSUniqueID = P5UniqueID

                            };
                            smsSentList.Add(smsSent);

                            IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(accountId, smsConfiguration, "Lmsstage", SqlProvider);
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
                                smsSent.UserInfoUserId = UserDetails.UserId;
                                using (var objDL = DLSmsSent.GetDLSmsSent(accountId, SqlProvider))
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

        }
        public async void SendMailToLead(int accountId, int MailTemplateId, string emailId, int contactid, string SqlProvider)
        {
            bool Result = false;
            string Message = "";
            UserInfo user = new UserInfo();
            StringBuilder Body = new StringBuilder();
            HelperForMail HelpMail = new HelperForMail(accountId, "", "");
            MailTemplate templateDetails = new MailTemplate { Id = MailTemplateId };
            Contact contactDetails = new Contact() { ContactId = contactid };
            string MailContent = "";
            using (var objDL = DLMailTemplate.GetDLMailTemplate(accountId, SqlProvider))
            {
                templateDetails = objDL.GETDetails(templateDetails);
            }

            string FromEmailId = "";
            string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(accountId, SqlProvider))
            {
                MailConfigForSending mailConfig = await objDL.GetActiveFromEmailId();
                if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                    FromEmailId = mailConfig.FromEmailId;
            }
            MailContent = await GetMailTemplateString(accountId, templateDetails, SqlProvider);

            Body.Clear().Append(MailContent);
            HelpMail.ChangeImageToOnlineUrl(Body, templateDetails);

            using (var objDL = DLContact.GetContactDetails(accountId, SqlProvider))
                contactDetails = await objDL.GetDetails(contactDetails, null);

            HelpMail.ReplaceContactDetails(Body, contactDetails);
            MailConfiguration configration = new MailConfiguration();

            using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(accountId, SqlProvider))
            {
                configration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
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
                        FromEmailId = FromEmailId,
                        FromName = FromName,
                        MailTemplateId = MailTemplateId,
                        ReplyTo = FromEmailId,
                        Subject = templateDetails.SubjectLine,
                        Subscribe = true,
                        IsSchedule = false,
                        IsTransaction = false,
                        Forward = false,
                        MessageBodyText = Body.ToString()
                    };

                    MLMailSent mailSent = new MLMailSent()
                    {
                        CampaignJobName = "",
                        ContactId = contactid,
                        EmailId = emailId,
                        GroupId = 0,
                        ResponseId = Guid.NewGuid().ToString(),
                        P5MailUniqueID = Guid.NewGuid().ToString(),
                        WorkFlowId = 0

                    };

                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                    {
                        ConfigurationId = 0,
                        GroupId = 0,
                    };

                    List<MLMailSent> mailSentList = new List<MLMailSent>();
                    mailSentList.Add(mailSent);

                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(accountId, mailSetting, mailSentSavingDetials, configration, "MailTrack", "LMS", 0, SqlProvider);

                    bool SentStatus = MailGeneralBaseFactory.SendBulkMail(mailSentList);
                    if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                    {
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
                            MailConfigurationNameId = configration.MailConfigurationNameId
                        };

                        using (var objDL = DLMailSent.GetDLMailSent(accountId, SqlProvider))
                        {
                            objDL.Send(responseMailSent);
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
        private async Task<string> GetMailTemplateString(int accountId, MailTemplate templateDetails, string SqlProvider)
        {
            MailTemplateFile mailTemplateFile;
            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(accountId, SqlProvider))
            {
                mailTemplateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
            }
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, templateDetails.Id);
            return awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload.bucketname);
        }
        public void BulkAssignMailandSmsNotification(List<string> BulkUserInfoUserIds, int AdsId)
        {
            int TotalLeadAssignPerUser = 0;
            List<string> DistinctUserInfoUserIds = new List<string>();
            DistinctUserInfoUserIds = BulkUserInfoUserIds.Distinct().ToList();
            if (DistinctUserInfoUserIds.Count > 0)
            {
                for (int i = 0; i < DistinctUserInfoUserIds.Count; i++)
                {
                    TotalLeadAssignPerUser = BulkUserInfoUserIds.Count(s => s == DistinctUserInfoUserIds[i]);
                    LeadAssigmentMailAndSmsToSalesPerson(Convert.ToInt32(DistinctUserInfoUserIds[i]), TotalLeadAssignPerUser, AdsId);
                }
            }
        }
        public async void LeadAssigmentMailAndSmsToSalesPerson(int UserInfoUserId, int NumberofLeadAssigned, int AdsId)
        {
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = new LeadAssignmentAgentNotification();
            UserInfo userInfo = null;
            string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\LmsBulkStageAssign.html";
            string MailBody = "";
            // string MessageContent = "";

            using (var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlVendor))
            {
                leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();
            }

            using (var objUserInfo = DLUserInfo.GetDLUserInfo(SqlVendor))
            {
                userInfo = await objUserInfo.GetDetail(UserInfoUserId);
                if (userInfo != null)
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        //#region Logs 
                        //string MailLogMessage = string.Empty;
                        //Int64 MailLogId = TrackLogs.SaveLog(AdsId, 0, "", "", "Plumb5GenralFunction", "LmsUpdateStageNotification-->Mail", "LeadAssigmentMailAndSmsToSalesPerson", "", JsonConvert.SerializeObject(new { UserInfoUserId = UserInfoUserId, NumberofLeadAssigned = NumberofLeadAssigned, AdsId = AdsId }));
                        //#endregion

                        MailConfiguration mailconfiguration = new MailConfiguration();
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(AdsId, SqlVendor))
                        {
                            mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                        }

                        string FromEmailId = "";
                        string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
                        using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(AdsId, SqlVendor))
                        {
                            MailConfigForSending mailConfig = await objDL.GetActiveFromEmailId();
                            if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                                FromEmailId = mailConfig.FromEmailId;
                        }

                        if ((mailconfiguration != null && mailconfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Mail) && !string.IsNullOrWhiteSpace(FromEmailId))
                        {
                            try
                            {
                                if (System.IO.File.Exists(filePath))
                                {
                                    using (StreamReader rd = new StreamReader(filePath))
                                    {
                                        MailBody = rd.ReadToEnd();
                                        rd.Close();
                                    }
                                    MailBody = MailBody.Replace("<!--UserName-->", userInfo.FirstName).Replace("<!--Message-->", NumberofLeadAssigned + " lead(s) assigned to you.").Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                                    MailSetting mailSetting = new MailSetting()
                                    {
                                        Forward = false,
                                        FromEmailId = FromEmailId,
                                        FromName = FromName,
                                        MailTemplateId = 0,
                                        ReplyTo = FromEmailId,
                                        Subject = "Lead has been assigned to you",
                                        Subscribe = true,
                                        MessageBodyText = MailBody,
                                        IsTransaction = false
                                    };

                                    MLMailSent mailSent = new MLMailSent()
                                    {
                                        MailCampaignId = 0,
                                        MailSendingSettingId = 0,
                                        GroupId = 0,
                                        ContactId = 0,
                                        EmailId = userInfo.EmailId,
                                        P5MailUniqueID = Guid.NewGuid().ToString()
                                    };

                                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                                    {
                                        ConfigurationId = 0,
                                        GroupId = 0
                                    };

                                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(AdsId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "LMS");
                                    bool SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                                    if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                                    {
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
                                            MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                        };

                                        using (var objDL = DLMailSent.GetDLMailSent(AdsId, SqlVendor))
                                        {
                                            await objDL.Send(responseMailSent);
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                            }
                        }
                        //else
                        //{
                        //    TrackLogs.UpdateLogs(MailLogId, JsonConvert.SerializeObject(new { Status = false, Message = "Please check Mail Configuration Settings" }), "Unable to send lead assignment mail as mail configuration settings is not done");
                        //}
                    }

                    if (!String.IsNullOrEmpty(userInfo.MobilePhone))
                    {
                        //#region Logs 
                        //string SMSLogMessage = string.Empty;
                        //Int64 SMSLogId = TrackLogs.SaveLog(AdsId, 0, "", "", "Plumb5GenralFunction", "LmsUpdateStageNotification-->Sms", "LeadAssigmentMailAndSmsToSalesPerson", "", JsonConvert.SerializeObject(new { UserInfoUserId = UserInfoUserId, NumberofLeadAssigned = NumberofLeadAssigned, AdsId = AdsId }));
                        //#endregion

                        SmsConfiguration smsConfiguration = new SmsConfiguration();
                        using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(AdsId, SqlVendor))
                        {
                            smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                        }
                        #region DLT Notification SMS
                        SmsNotificationTemplate smsNotificationTemplate;
                        using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(AdsId, SqlVendor))
                        {
                            smsNotificationTemplate = await obj.GetByIdentifier("lmstotalleadassign");
                        }
                        #endregion DLT Notification SMS
                        if ((smsConfiguration != null && smsConfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Sms) && smsNotificationTemplate.IsSmsNotificationEnabled)
                        {
                            try
                            {
                                // MessageContent = NumberofLeadAssigned + " lead(s) has been assigned to you.";

                                string LmsTotalLeadAssignMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*NumberofLeadAssigned*}]", Convert.ToString(NumberofLeadAssigned));

                                SmsSent smsSent = new SmsSent()
                                {
                                    CampaignJobName = "campaign",
                                    ContactId = 0,
                                    GroupId = 0,
                                    MessageContent = LmsTotalLeadAssignMessageContent,
                                    PhoneNumber = userInfo.MobilePhone,
                                    SmsSendingSettingId = 0,
                                    SmsTemplateId = 0,
                                    VendorName = smsConfiguration.ProviderName,
                                    IsUnicodeMessage = false,
                                    VendorTemplateId = smsNotificationTemplate.VendorTemplateId
                                };

                                IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, SqlVendor, "campaign");
                                bool SmsSentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);
                                string SmsErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                                if (SmsSentStatus)
                                {
                                    Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                    smsSent.SentDate = DateTime.Now;
                                    smsSent.IsDelivered = 0;
                                    smsSent.IsClicked = 0;
                                    smsSent.Operator = null;
                                    smsSent.Circle = null;
                                    smsSent.DeliveryTime = null;
                                    smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;

                                    using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlVendor))
                                    {
                                        await objDLSMS.Save(smsSent);
                                    }

                                    //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = true, Message = "Lead Assignment SMS has been sent" }), "Lead Assignment SMS has been sent");
                                }
                                else
                                {
                                    Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);
                                    smsSent.SentDate = DateTime.Now;
                                    smsSent.IsDelivered = 0;
                                    smsSent.IsClicked = 0;
                                    smsSent.Operator = null;
                                    smsSent.Circle = null;
                                    smsSent.DeliveryTime = null;
                                    smsSent.SendStatus = 0;
                                    smsSent.ReasonForNotDelivery = SmsErrorMessage;
                                    smsSent.SmsSendingSettingId = smsConfiguration.SmsConfigurationNameId;

                                    using (var objDLSMS = DLSmsSent.GetDLSmsSent(AdsId, SqlVendor))
                                    {
                                        await objDLSMS.Save(smsSent);
                                    }
                                    //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = false, Message = SmsErrorMessage }), "Unable to send lead assignment sms");
                                }
                            }
                            catch (Exception ex)
                            {
                            }
                        }
                        //else
                        //{
                        //    TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = false, Message = "Please check SMS Configuration Settings" }), "Unable to send lead assignment SMS as SMS configuration settings is not done");
                        //}
                    }
                }
            }
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
