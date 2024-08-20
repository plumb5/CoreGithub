using IP5GenralDL;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class LeadAddOrUpdate
    {
        private readonly string SqlVendor;

        public LeadAddOrUpdate(string sqlVendor)
        {
            SqlVendor = sqlVendor;
        }

        public async Task<Tuple<bool, int, UserInfo, string>> EmailCheck(string EmailId, int ContactId, int AdsId, int UserId)
        {
            UserInfo userdetails = new UserInfo();
            MLContact? mLContact = new MLContact();

            bool Status = false;
            int contactid = 0;
            int ContactLeadId = 0;

            if (!string.IsNullOrEmpty(EmailId))
            {
                using (var objcontact = DLContact.GetContactDetails(AdsId, SqlVendor))
                {
                    contactid = await objcontact.CheckEmailIdExists(EmailId);

                    //This checking is for edit profile which already has contact id 
                    if (ContactId > 0)
                    {
                        if (contactid <= 0 || contactid == ContactId)
                        {
                            Status = false;
                            return Tuple.Create(Status, ContactLeadId, userdetails, EmailId);
                        }
                    }

                    if (contactid > 0)
                    {
                        mLContact = await objcontact.GetLeadsByContactId(contactid);

                        if (ContactId > 0)  //Edit (This is for edit profile for checking the old contact details while updating the lead)
                        {
                            if (contactid != ContactId && mLContact == null)
                            {
                                Status = true;
                                ContactLeadId = 0;
                                return Tuple.Create(Status, ContactLeadId, userdetails, EmailId);
                            }
                            else
                            {
                                ContactLeadId = mLContact.ContactId;
                                var FinalResult = await HierarchyStatus(UserId, AdsId, mLContact.UserInfoUserId);
                                Status = FinalResult.Item1;
                                userdetails = FinalResult.Item2;
                            }
                        }
                        else   //New (This is for checking the new contact details while adding the lead)
                        {
                            if (mLContact != null && mLContact.UserInfoUserId > 0)
                            {
                                ContactLeadId = mLContact.ContactId;
                                var FinalResult = await HierarchyStatus(UserId, AdsId, mLContact.UserInfoUserId);
                                Status = FinalResult.Item1;
                                userdetails = FinalResult.Item2;
                            }
                        }
                    }
                }
            }
            return Tuple.Create(Status, ContactLeadId, userdetails, EmailId);
        }

        public async Task<Tuple<bool, int, UserInfo, string>> PhoneNumberCheck(string PhoneNumber, int ContactId, int AdsId, int UserId)
        {
            UserInfo userdetails = new UserInfo();

            bool Status = false;
            int contactid = 0;
            int ContactLeadId = 0;
            MLContact? mLContact = new MLContact();

            if (!string.IsNullOrEmpty(PhoneNumber))
            {
                using (var objcontact = DLContact.GetContactDetails(AdsId, SqlVendor))
                {
                    contactid = await objcontact.CheckPhoneNumberExists(PhoneNumber);

                    if (ContactId > 0)
                    {
                        if (contactid <= 0 || contactid == ContactId)
                        {
                            Status = false;
                            return Tuple.Create(Status, ContactLeadId, userdetails, PhoneNumber);
                        }
                    }

                    if (contactid > 0)
                    {
                        mLContact = await objcontact.GetLeadsByContactId(contactid);

                        if (ContactId > 0)  //Edit 
                        {
                            if (contactid != ContactId && mLContact == null)
                            {
                                Status = true;
                                ContactLeadId = 0;
                                return Tuple.Create(Status, ContactLeadId, userdetails, PhoneNumber);
                            }
                            else
                            {
                                ContactLeadId = mLContact.ContactId;
                                var FinalResult = await HierarchyStatus(UserId, AdsId, mLContact.UserInfoUserId);
                                Status = FinalResult.Item1;
                                userdetails = FinalResult.Item2;
                            }
                        }
                        else  //New
                        {
                            if (mLContact != null && mLContact.UserInfoUserId > 0)
                            {
                                ContactLeadId = mLContact.ContactId;
                                var FinalResult = await HierarchyStatus(UserId, AdsId, mLContact.UserInfoUserId);
                                Status = FinalResult.Item1;
                                userdetails = FinalResult.Item2;
                            }
                        }
                    }
                }
            }
            return Tuple.Create(Status, ContactLeadId, userdetails, PhoneNumber);
        }

        private async Task<Tuple<bool, UserInfo>> HierarchyStatus(int UserId, int AdsId, int UserInfoUserId)
        {
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            UserInfo? userdetails = new UserInfo();
            using var objuser = DLUserInfo.GetDLUserInfo(SqlVendor);
            bool hierarchystatus = false;

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SqlVendor))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(UserId, AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(UserId));
            }

            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            userdetails = await objuser.GetDetail(UserInfoUserId);

            if (userHierarchy != null && userHierarchy.Any(x => x.UserInfoUserId == UserInfoUserId))
                hierarchystatus = false;
            else
                hierarchystatus = true;

            return Tuple.Create(hierarchystatus, userdetails);
        }

        public async Task<bool> LeadNoteSavingAssignSalesManageCustom(int UserInfoUserId, int OldUserInfoUserId, int ContactId, Contact contact, string[] answerList, int AdsId, int UserId)
        {
            try
            {
                if (UserInfoUserId > 0)
                {
                    if (ContactId > 0 && UserInfoUserId > 0 && OldUserInfoUserId != UserInfoUserId)
                    {
                        int[] lmsEachLeadIdList = new int[] { ContactId };
                        AssignSalesPerson(lmsEachLeadIdList, UserInfoUserId, AdsId);
                    }
                }
                else
                {
                    using var objLms = DLLmsStageNotification.GetDLLmsStageNotification(AdsId, SqlVendor);
                    LmsStageNotification? lmsStageNotification = await objLms.GET(contact.Score);
                    LmsUpdateStageNotification obj = new LmsUpdateStageNotification();

                    if (lmsStageNotification != null && (lmsStageNotification.AssignUserInfoUserId > 0 || lmsStageNotification.AssignUserGroupId > 0))
                    {
                        MLContact mLContact = new MLContact();
                        Helper.Copy(contact, mLContact);
                        await obj.AssignDependingUponStage(AdsId, mLContact, lmsStageNotification);
                    }
                    else
                    {
                        if (ContactId > 0 && OldUserInfoUserId != UserId)
                        {
                            int[] lmsEachLeadIdList = new int[] { ContactId };
                            AssignSalesPerson(lmsEachLeadIdList, UserId, AdsId);
                        }
                    }
                }

                //Part - 03 --- Notes Saving Part
                if (ContactId > 0)
                {
                    if (!String.IsNullOrEmpty(contact.Remarks))
                    {
                        Notes notes = new Notes() { ContactId = ContactId, Content = contact.Remarks };
                        using (var objDLNotes = DLNotes.GetDLNotes(AdsId, SqlVendor))
                        {
                            await objDLNotes.Save(notes);
                        }
                    }
                }

                //Part - 04 --- Custom Fields Saving Part
                if (ContactId > 0)
                {
                    //Here the below function need to update contact custom fields...
                    ManageCustomFields objcustfields = new ManageCustomFields(AdsId, SqlVendor);
                    objcustfields.UpdateCustomFields(answerList, "UpdateContactCustomFields", ContactId);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> AssignSalesPerson(int[] lmsEachLeadIdList, int UserInfoUserId, int AdsId, bool IsAssignment = true, int lmsid = 0, int LmsGroupMemberId = 0)
        {
            UserInfo userInfo = null;
            MLContact mLContact = new MLContact();

            using var objDLleadassignment = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(AdsId, SqlVendor);
            LeadAssignmentAgentNotification? leadAssignmentAgentNotification = await objDLleadassignment.GetLeadAssignmentAgentNotification();

            MailConfiguration? mailconfiguration = new MailConfiguration();
            SmsConfiguration? smsConfigration = new SmsConfiguration();

            //here we are using transactions mail for sending mail
            using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(AdsId, SqlVendor))
            {
                mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            using (var objDLSms = DLSmsConfiguration.GetDLSmsConfiguration(AdsId, SqlVendor))
            {
                smsConfigration = await objDLSms.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            string FromEmailId = "";
            string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(AdsId, SqlVendor))
            {
                MailConfigForSending? mailConfig = await objDL.GetActiveFromEmailId();
                if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                    FromEmailId = mailConfig.FromEmailId;
            }

            int totalAssignmentDone = 0;
            try
            {
                List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();

                using var objContactFields = DLContactExtraField.GetDLContactExtraField(AdsId, SqlVendor);
                contactExtraFields = await objContactFields.GetList();

                bool IsBulkAssignment = false;
                if (lmsEachLeadIdList.Length > 5)
                    IsBulkAssignment = true;
                foreach (var ContactId in lmsEachLeadIdList)
                {
                    bool UpdatedStatus = true;

                    if (IsAssignment)
                    {
                        using (var objDL = DLContact.GetContactDetails(AdsId, SqlVendor))
                        {
                            await objDL.AssignSalesPerson(ContactId, UserInfoUserId, LmsGroupMemberId);
                            await objDL.UpdateUserInfoUserId(ContactId, UserInfoUserId);
                        }
                    }
                    else
                    {
                        UpdatedStatus = true;
                    }

                    if (UpdatedStatus)
                    {
                        if (!IsBulkAssignment)
                        {
                            if ((mailconfiguration != null && mailconfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Mail) && !string.IsNullOrWhiteSpace(FromEmailId))
                            {
                                string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\PlumbAlert.htm";
                                string MailBody = "";
                                if (System.IO.File.Exists(filePath))
                                {
                                    using (var objUserInfo = DLUserInfo.GetDLUserInfo(SqlVendor))
                                    {
                                        userInfo = await objUserInfo.GetDetail(UserInfoUserId);
                                    }

                                    using (StreamReader rd = new StreamReader(filePath))
                                    {
                                        MailBody = rd.ReadToEnd();
                                        rd.Close();
                                    }

                                    using (var objDLContact = DLContact.GetContactDetails(AdsId, SqlVendor))
                                    {
                                        mLContact = await objDLContact.GetLeadsWithContact(ContactId, LmsGroupMemberId);
                                    }

                                    StringBuilder ContactDetails = new StringBuilder("Lead Contact details of source " + mLContact.LmsGroupName + " are <br /> ");

                                    if (mLContact != null)
                                    {
                                        if (mLContact.ContactId > 0)
                                        {
                                            if (!String.IsNullOrEmpty(mLContact.Name) && mLContact.Name != "")
                                                ContactDetails.Append("<br /> Name : " + mLContact.Name + "");

                                            if (!String.IsNullOrEmpty(mLContact.EmailId) && mLContact.EmailId != "")
                                                ContactDetails.Append("<br /> EmailId : " + mLContact.EmailId + "");

                                            if (!String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "")
                                                ContactDetails.Append("<br /> PhoneNumber : " + mLContact.PhoneNumber + "");
                                        }
                                    }

                                    int k = 1;
                                    foreach (PropertyInfo pi in mLContact.GetType().GetProperties())
                                    {
                                        if (pi.Name != "Id" && pi.Name != "UserInfoUserId" && pi.Name != "ContactId" && pi.Name != "UserGroupId" && pi.Name != "LmsGroupId" && pi.Name != "ReminderDate" && pi.Name != "ToReminderPhoneNumber" && pi.Name != "ToReminderEmailId" && pi.Name != "Score" && pi.Name != "LastModifyByUserId" && pi.Name != "LmsGroupName" && pi.Name != "IsAdSenseOrAdWord" && pi.Name != "AccountId" && pi.Name != "Notes" && pi.Name != "Name" && pi.Name != "EmailId" && pi.Name != "PhoneNumber")
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
                                        ContactId = UserInfoUserId,
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
                                #region DLT Notification SMS
                                SmsNotificationTemplate? smsNotificationTemplate;
                                using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(AdsId, SqlVendor))
                                {

                                    smsNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");
                                }
                                #endregion DLT Notification SMS

                                if ((smsConfigration != null && smsConfigration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Sms && smsNotificationTemplate.IsSmsNotificationEnabled))
                                {
                                    try
                                    {
                                        if (userInfo != null && !String.IsNullOrEmpty(userInfo.MobilePhone))
                                        {
                                            string LeadAssignMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                             .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                             .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber);

                                            string MessageContent = System.Web.HttpUtility.HtmlDecode(LeadAssignMessageContent);

                                            SmsSent smsSent = new SmsSent()
                                            {
                                                CampaignJobName = "LMS",
                                                ContactId = 0,
                                                GroupId = 0,
                                                MessageContent = MessageContent,
                                                PhoneNumber = userInfo.MobilePhone,
                                                SmsSendingSettingId = 0,
                                                SmsTemplateId = 0,
                                                VendorName = smsConfigration.ProviderName,
                                                IsUnicodeMessage = false,
                                                VendorTemplateId = smsNotificationTemplate.VendorTemplateId
                                            };

                                            IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfigration, "campaign", SqlVendor);
                                            bool SmsSentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);
                                            string SmsErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                                            Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                            if (SmsSentStatus)
                                            {
                                                smsSent.ResponseId = SmsGeneralBaseFactory.VendorResponses[0].ResponseId;
                                                smsSent.SentDate = DateTime.Now;
                                                smsSent.IsDelivered = 0;
                                                smsSent.IsClicked = 0;
                                                smsSent.Operator = null;
                                                smsSent.Circle = null;
                                                smsSent.DeliveryTime = null;
                                                smsSent.SmsConfigurationNameId = smsConfigration.SmsConfigurationNameId;
                                                smsSent.SmsSendingSettingId = 0;
                                                using (var objDLSMS =   DLSmsSent.GetDLSmsSent(AdsId,SqlVendor))
                                                {
                                                    await objDLSMS.Save(smsSent);
                                                }
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
                                                smsSent.SmsConfigurationNameId = smsConfigration.SmsConfigurationNameId;
                                                smsSent.SmsSendingSettingId =0;
                                                using (var objDLSMS =   DLSmsSent.GetDLSmsSent(AdsId,SqlVendor))
                                                {
                                                    await objDLSMS.Save(smsSent);
                                                }
                                            }
                                        }
                                    }
                                    catch
                                    {

                                    }
                                }
                                #region Whats App
                                if (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.WhatsApp)
                                {
                                    if (leadAssignmentAgentNotification.WhatsApp && !string.IsNullOrEmpty(userInfo.MobilePhone))
                                    {
                                        List<LmsGroup> LmsGroupList = new List<LmsGroup>();
                                        using (var objGroup = DLLmsGroup.GetDLLmsGroup(AdsId, SqlVendor))
                                        {
                                            LmsGroupList = (await objGroup.GetLMSGroup(LmsGroupMemberId)).ToList();
                                        }
                                        string lmsgroupname = "";
                                        if (LmsGroupList.Count > 0)
                                            lmsgroupname = LmsGroupList[0].Name;
                                        //bool SentStatus = false;
                                        string UserAttributeMessageDetails = "";
                                        string UserButtonOneDynamicURLDetails = "";
                                        string UserButtonTwoDynamicURLDetails = "";
                                        string MediaURLDetails = "";
                                        string langcode = "";
                                        WhatsappSent watsAppSent = new WhatsappSent();

                                        string PhoneNumber = userInfo.MobilePhone;
                                        bool isValidPhoneNumber = Helper.IsValidPhoneNumber(ref PhoneNumber);

                                        if (isValidPhoneNumber)
                                        {
                                            WhatsAppConfiguration? whatsappConfiguration = new WhatsAppConfiguration();

                                            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(AdsId, SqlVendor))
                                            {
                                                whatsappConfiguration = await objBL.GetConfigurationDetailsForSending(IsDefaultProvider: true);
                                            }

                                            #region Notification WhatsApp
                                            WhatsAppNotificationTemplate? whatsappNotificationTemplate;
                                            using (var obj = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(AdsId, SqlVendor))
                                            {
                                                whatsappNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");
                                            }
                                            #endregion Notification WhatsApp

                                            if (whatsappConfiguration != null && whatsappConfiguration.Id > 0 && whatsappNotificationTemplate != null && whatsappNotificationTemplate.IsWhatsAppNotificationEnabled)
                                            {
                                                string UserName = "";
                                                string UserPhone = "";
                                                string AccountName = "";
                                                string ContactName = "";

                                                if (mLContact != null && !string.IsNullOrEmpty(mLContact.Name))
                                                    ContactName = mLContact.Name;



                                                HelperForSMS HelpSMS = new HelperForSMS(AdsId, SqlVendor);
                                                StringBuilder UserButtonOneBodydata = new StringBuilder();
                                                StringBuilder UserButtonTwoBodydata = new StringBuilder();
                                                StringBuilder MediaUrlBodyData = new StringBuilder();
                                                if (!string.IsNullOrEmpty(whatsappNotificationTemplate.UserAttributes))
                                                {
                                                    UserAttributeMessageDetails = whatsappNotificationTemplate.UserAttributes.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                                 .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                                 .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                                 .Replace("[{*LmsGroupName*}]", lmsgroupname);

                                                    whatsappNotificationTemplate.TemplateContent = whatsappNotificationTemplate.TemplateContent.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                                 .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                                 .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                                 .Replace("[{*LmsGroupName*}]", lmsgroupname);

                                                    if (!string.IsNullOrEmpty(UserAttributeMessageDetails))
                                                        UserAttributeMessageDetails = UserAttributeMessageDetails.Replace(",", "$@$");
                                                }

                                                if (!string.IsNullOrEmpty(whatsappNotificationTemplate.TemplateLanguage))
                                                {
                                                    if (whatsappNotificationTemplate.TemplateLanguage == "English")
                                                        langcode = "en";
                                                }

                                                if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                                                {
                                                    WhatsappSent watsappsent = new WhatsappSent()
                                                    {
                                                        MediaFileURL = MediaURLDetails,
                                                        PhoneNumber = PhoneNumber,
                                                        UserAttributes = UserAttributeMessageDetails,
                                                        ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                        ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                        CampaignJobName = "LMS",
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
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
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
                                                        CampaignJobName = "LMS",
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
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
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
                                                        CampaignJobName = "LMS",
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
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
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
                                                        CampaignJobName = "LMS",
                                                        ContactId = mLContact.ContactId,
                                                        GroupId = 0,
                                                        MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                        WhatsappSendingSettingId = 0,
                                                        WhatsappTemplateId = 0,
                                                        VendorName = whatsappConfiguration.ProviderName
                                                    };
                                                    whatsappSentList.Add(mlwatsappsent);
                                                    bool SentStatus = false;
                                                    IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(AdsId, whatsappConfiguration, "campaign");
                                                    SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                                                    string ErrorMessage = WhatsAppGeneralBaseFactory.ErrorMessage;

                                                    if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                                                    {
                                                        Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                                                        using (var objDL =   DLWhatsAppSent.GetDLWhatsAppSent(AdsId,SqlVendor))
                                                        {
                                                            await objDL.Save(watsAppSent);
                                                        }
                                                    }
                                                    else if (!SentStatus && !string.IsNullOrEmpty(ErrorMessage))
                                                    {
                                                        Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                                                        using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId, SqlVendor))
                                                        {
                                                            await objDL.Save(watsAppSent);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                #endregion
                            }
                            totalAssignmentDone++;
                        }
                    }
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }
    }
}
