﻿using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public partial class DLContactSQL : CommonDataBaseInteraction, IDLContact
    {
        CommonInfo connection;
        int AccountId;
        public DLContactSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
            AccountId = adsId;
        }

        public DLContactSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(Contact contact, ContactMergeConfiguration? mergeConfiguration = null)
        {
            string storeProcCommand = "Contact_Details_SaveOrUpdate";
            object? param = new
            {
                Action = "Save",
                mergeConfiguration.PrimaryEmail,
                mergeConfiguration.PrimarySMS,
                mergeConfiguration.AlternateEmail,
                mergeConfiguration.AlternateSMS,
                contact.ContactId,
                contact.UserInfoUserId,
                contact.UserGroupId,
                contact.Name,
                contact.EmailId,
                contact.PhoneNumber,
                contact.Unsubscribe,
                contact.LeadType,
                contact.ProfilePic,
                contact.Gender,
                contact.Age,
                contact.AgeRange,
                contact.MaritalStatus,
                contact.Education,
                contact.Occupation,
                contact.Interests,
                contact.KloutScore,
                contact.Location,
                contact.FacebookId,
                contact.FacebookUrl,
                contact.FacebookUserName,
                contact.TwitterId,
                contact.TwitterScreenName,
                contact.TwitterUserName,
                contact.TwitterUrl,
                contact.LinkedinId,
                contact.LinkedinUserName,
                contact.LinkedinUrl,
                contact.GoogleplusUrl,
                contact.YoutubeUrl,
                contact.PicasaUrl,
                contact.WordpressUrl,
                contact.VimeoUrl,
                contact.MyspaceUrl,
                contact.GravatarUrl,
                contact.FoursquareUrl,
                contact.KloutUrl,
                contact.YahooUrl,
                contact.FBLastUpdates,
                contact.IsVerifiedMailId,
                contact.IsVerifiedContactNumber,
                contact.CreatedDate,
                contact.LookedupStatus,
                contact.AppType,
                contact.CustomField1,
                contact.CustomField2,
                contact.CustomField3,
                contact.CustomField4,
                contact.CustomField5,
                contact.CustomField6,
                contact.CustomField7,
                contact.CustomField8,
                contact.CustomField9,
                contact.CustomField10,
                contact.CustomField11,
                contact.CustomField12,
                contact.CustomField13,
                contact.CustomField14,
                contact.CustomField15,
                contact.CustomField16,
                contact.CustomField17,
                contact.CustomField18,
                contact.CustomField19,
                contact.CustomField20,
                contact.AlternateEmailIds,
                contact.AlternatePhoneNumbers,
                contact.PinterestUrl,
                contact.AboutmeUrl,
                contact.InstagramUrl,
                contact.QuoraUrl,
                contact.OverAllTimeSpentInSiteInSec,
                contact.OverAllTimeSpentInChatInSec,
                contact.NoOfSession,
                contact.PastChatCount,
                contact.TotalChatCountSessionWise,
                contact.ReferralSourceList,
                contact.NumOfPageVisited,
                contact.OverAllScore,
                contact.MailScore,
                contact.MailScoreType,
                contact.SMSScore,
                contact.SMSScoreType,
                contact.MemberId,
                contact.BusinessUserIndividualUser,
                contact.LastPurchase,
                contact.LastMessageSent,
                contact.HasOnlyOfflineTransactionTagType,
                contact.TotalLifeTimePurchaseValue,
                contact.TotalLifetimeTranCount,
                contact.RecentOnlineVisit,
                contact.ReferType,
                contact.UtmTagsList,
                contact.UtmTagSource,
                contact.USSDUnsubscribe,
                contact.IsSmsUnsubscribe,
                contact.SubscribedDate,
                contact.OptInOverAllNewsLetter,
                contact.UpdatedDate,
                contact.SmsSubscribedDate,
                contact.SmsOptInOverAllNewsLetter,
                contact.USSDSubscribedDate,
                contact.USSDOptInOverAllNewsLetter,
                contact.Country,
                contact.IsAppDownLoaded,
                contact.AppDownLoadedDate,
                contact.IsAppRegistered,
                contact.AppRegisteredDate,
                contact.FirstUtmMedium,
                contact.FirstUtmCampaign,
                contact.FirstUtmTerm,
                contact.FirstUtmContent,
                contact.LastName,
                contact.ContactSource,
                contact.IsAccountHolder,
                contact.AccountType,
                contact.AccountOpenedSource,
                contact.LastActivityLoginDate,
                contact.LastActivityLoginSource,
                contact.CustomerScore,
                contact.AccountAmount,
                contact.IsCustomer,
                contact.IsMoneyTransferCustomer,
                contact.IsGoalSaver,
                contact.IsReferred,
                contact.IsReferredOpenedAccount,
                contact.IsComplaintRaised,
                contact.ComplaintType,
                contact.Project,
                contact.ProjectDate,
                contact.IsTCCustomer,
                contact.OriginalFICAInd,
                contact.CurrentFICAInd,
                contact.IsFundsDebit,
                contact.IsFundsGoalsave,
                contact.OriginatingChannel,
                contact.IsMoneyDeposited,
                contact.LoyaltyPoints,
                contact.LoyaltyPointsPeriod,
                contact.Rsaid,
                contact.StoreType,
                contact.StoreName,
                contact.Designation,
                contact.ProspectStage,
                contact.CountryCode,
                contact.RegistrationSource,
                contact.QualifiedForRewardsStore,
                contact.TCsVersionAccepted,
                contact.AccountNumber,
                contact.AccountDateTime,
                contact.TransactionValue,
                contact.CaseNumber,
                contact.LoanApplicationId,
                contact.NumberOfDependents,
                contact.Salary,
                contact.ApplicantIncome,
                contact.MonthlyIncome,
                contact.LoanAmount,
                contact.BalanceAmount,
                contact.TenureOfLoan,
                contact.CreditHistory,
                contact.CreditScore,
                contact.PropertyArea,
                contact.LoanStatus,
                contact.IsOwnHouse,
                contact.HasCreditCard,
                contact.IsActiveMember,
                contact.NumberOfAccountsHold,
                contact.StoryMessage,
                contact.Question,
                contact.QuestionID,
                contact.ApplicantId,
                contact.ProspectId,
                contact.AccountBranchName,
                contact.BureauType,
                contact.CityCategory,
                contact.CustomerId,
                contact.EcsActive,
                contact.EtpNtp,
                contact.SegmentType,
                contact.ContactSubSource,
                contact.AccountCardType,
                contact.AffluenceParameter,
                contact.AffluenceParameterRisk,
                contact.CustomField21,
                contact.CustomField22,
                contact.CustomField23,
                contact.CustomField24,
                contact.CustomField25,
                contact.CustomField26,
                contact.CustomField27,
                contact.CustomField28,
                contact.CustomField29,
                contact.CustomField30,
                contact.CustomField31,
                contact.CustomField32,
                contact.CustomField33,
                contact.CustomField34,
                contact.CustomField35,
                contact.CustomField36,
                contact.CustomField37,
                contact.CustomField38,
                contact.CustomField39,
                contact.CustomField40,
                contact.CustomField41,
                contact.CustomField42,
                contact.CustomField43,
                contact.CustomField44,
                contact.CustomField45,
                contact.CustomField46,
                contact.CustomField47,
                contact.CustomField48,
                contact.CustomField49,
                contact.CustomField50,
                contact.CustomField51,
                contact.CustomField52,
                contact.CustomField53,
                contact.CustomField54,
                contact.CustomField55,
                contact.CustomField56,
                contact.CustomField57,
                contact.CustomField58,
                contact.CustomField59,
                contact.CustomField60,
                contact.IsDeviceIdExists,
                contact.IsAdSenseOrAdWord,
                contact.LastModifyByUserId,
                contact.LmsGroupId,
                contact.Remarks,
                contact.ReminderDate,
                contact.ToReminderPhoneNumber,
                contact.ToReminderEmailId,
                contact.Score,
                contact.SearchKeyword,
                contact.PageUrl,
                contact.ReferrerUrl,
                contact.Place,
                contact.MailTemplateId,
                contact.MailAlertScheduleDate,
                contact.FromEmailId,
                contact.Subject,
                contact.FromName,
                contact.SmsTemplateId,
                contact.SmsAlertScheduleDate,
                contact.CustomSmsContent,
                contact.Address1,
                contact.Address2,
                contact.StateName,
                contact.ZipCode,
                contact.Religion,
                contact.DomainName,
                contact.CompanyName,
                contact.CompanyWebUrl,
                contact.CompanyAddress,
                contact.MailUnsubscribeDate,
                contact.SmsUnsubscribeDate,
                contact.UssdUnsubscribeDate,
                contact.Projects,
                contact.FormId,
                contact.AllFormIds,
                contact.ChatId,
                contact.AllChatIds,
                contact.IsNewLead,
                contact.EnquiryType,
                contact.CallStatus,
                contact.LostReason,
                contact.SiteVisitDate,
                contact.FloorPreference,
                contact.LocationPreference,
                contact.PreferenceHouseType,
                contact.ReasonForFollowUp,
                contact.PurchasePlanDate,
                contact.IsSiteVisitBooked,
                contact.IsSiteVisitCompleted,
                contact.IsWhatsAppOptIn,
                contact.WhatsAppConsentDate,
                contact.ScoreUpdatedDate,
                contact.LeadLabel,
                contact.FollowUpContent,
                contact.FollowUpStatus,
                contact.FollowUpDate,
                contact.FollowUpUserId,
                contact.FollowUpUpdatedDate,
                contact.LeadLabelUpdatedDate,
                contact.FollowUpCreatedDate,
                contact.HandledByUpdatedDate,
                contact.CreatedUserInfoUserId,
                contact.IsSourceMoved,
                contact.SourceMovedDate,
                contact.RepeatLeadCount,
                contact.CustomField61,
                contact.CustomField62,
                contact.CustomField63,
                contact.CustomField64,
                contact.CustomField65,
                contact.CustomField66,
                contact.CustomField67,
                contact.CustomField68,
                contact.CustomField69,
                contact.CustomField70,
                contact.CustomField71,
                contact.CustomField72,
                contact.CustomField73,
                contact.CustomField74,
                contact.CustomField75,
                contact.CustomField76,
                contact.CustomField77,
                contact.CustomField78,
                contact.CustomField79,
                contact.CustomField80,
                contact.CustomField81,
                contact.CustomField82,
                contact.CustomField83,
                contact.CustomField84,
                contact.CustomField85,
                contact.CustomField86,
                contact.CustomField87,
                contact.CustomField88,
                contact.CustomField89,
                contact.CustomField90,
                contact.CustomField91,
                contact.CustomField92,
                contact.CustomField93,
                contact.CustomField94,
                contact.CustomField95,
                contact.CustomField96,
                contact.CustomField97,
                contact.CustomField98,
                contact.CustomField99,
                contact.CustomField100
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(Contact contact, ContactMergeConfiguration? mergeConfiguration = null)
        {

            string storeProcCommand = "Contact_Details_SaveOrUpdate";
            object? param = new
            {
                Action = "Save",
                mergeConfiguration.PrimaryEmail,
                mergeConfiguration.PrimarySMS,
                mergeConfiguration.AlternateEmail,
                mergeConfiguration.AlternateSMS,
                contact.ContactId,
                contact.UserInfoUserId,
                contact.UserGroupId,
                contact.Name,
                contact.EmailId,
                contact.PhoneNumber,
                contact.Unsubscribe,
                contact.LeadType,
                contact.ProfilePic,
                contact.Gender,
                contact.Age,
                contact.AgeRange,
                contact.MaritalStatus,
                contact.Education,
                contact.Occupation,
                contact.Interests,
                contact.KloutScore,
                contact.Location,
                contact.FacebookId,
                contact.FacebookUrl,
                contact.FacebookUserName,
                contact.TwitterId,
                contact.TwitterScreenName,
                contact.TwitterUserName,
                contact.TwitterUrl,
                contact.LinkedinId,
                contact.LinkedinUserName,
                contact.LinkedinUrl,
                contact.GoogleplusUrl,
                contact.YoutubeUrl,
                contact.PicasaUrl,
                contact.WordpressUrl,
                contact.VimeoUrl,
                contact.MyspaceUrl,
                contact.GravatarUrl,
                contact.FoursquareUrl,
                contact.KloutUrl,
                contact.YahooUrl,
                contact.FBLastUpdates,
                contact.IsVerifiedMailId,
                contact.IsVerifiedContactNumber,
                contact.CreatedDate,
                contact.LookedupStatus,
                contact.AppType,
                contact.CustomField1,
                contact.CustomField2,
                contact.CustomField3,
                contact.CustomField4,
                contact.CustomField5,
                contact.CustomField6,
                contact.CustomField7,
                contact.CustomField8,
                contact.CustomField9,
                contact.CustomField10,
                contact.CustomField11,
                contact.CustomField12,
                contact.CustomField13,
                contact.CustomField14,
                contact.CustomField15,
                contact.CustomField16,
                contact.CustomField17,
                contact.CustomField18,
                contact.CustomField19,
                contact.CustomField20,
                contact.AlternateEmailIds,
                contact.AlternatePhoneNumbers,
                contact.PinterestUrl,
                contact.AboutmeUrl,
                contact.InstagramUrl,
                contact.QuoraUrl,
                contact.OverAllTimeSpentInSiteInSec,
                contact.OverAllTimeSpentInChatInSec,
                contact.NoOfSession,
                contact.PastChatCount,
                contact.TotalChatCountSessionWise,
                contact.ReferralSourceList,
                contact.NumOfPageVisited,
                contact.OverAllScore,
                contact.MailScore,
                contact.MailScoreType,
                contact.SMSScore,
                contact.SMSScoreType,
                contact.MemberId,
                contact.BusinessUserIndividualUser,
                contact.LastPurchase,
                contact.LastMessageSent,
                contact.HasOnlyOfflineTransactionTagType,
                contact.TotalLifeTimePurchaseValue,
                contact.TotalLifetimeTranCount,
                contact.RecentOnlineVisit,
                contact.ReferType,
                contact.UtmTagsList,
                contact.UtmTagSource,
                contact.USSDUnsubscribe,
                contact.IsSmsUnsubscribe,
                contact.SubscribedDate,
                contact.OptInOverAllNewsLetter,
                contact.UpdatedDate,
                contact.SmsSubscribedDate,
                contact.SmsOptInOverAllNewsLetter,
                contact.USSDSubscribedDate,
                contact.USSDOptInOverAllNewsLetter,
                contact.Country,
                contact.IsAppDownLoaded,
                contact.AppDownLoadedDate,
                contact.IsAppRegistered,
                contact.AppRegisteredDate,
                contact.FirstUtmMedium,
                contact.FirstUtmCampaign,
                contact.FirstUtmTerm,
                contact.FirstUtmContent,
                contact.LastName,
                contact.ContactSource,
                contact.IsAccountHolder,
                contact.AccountType,
                contact.AccountOpenedSource,
                contact.LastActivityLoginDate,
                contact.LastActivityLoginSource,
                contact.CustomerScore,
                contact.AccountAmount,
                contact.IsCustomer,
                contact.IsMoneyTransferCustomer,
                contact.IsGoalSaver,
                contact.IsReferred,
                contact.IsReferredOpenedAccount,
                contact.IsComplaintRaised,
                contact.ComplaintType,
                contact.Project,
                contact.ProjectDate,
                contact.IsTCCustomer,
                contact.OriginalFICAInd,
                contact.CurrentFICAInd,
                contact.IsFundsDebit,
                contact.IsFundsGoalsave,
                contact.OriginatingChannel,
                contact.IsMoneyDeposited,
                contact.LoyaltyPoints,
                contact.LoyaltyPointsPeriod,
                contact.Rsaid,
                contact.StoreType,
                contact.StoreName,
                contact.Designation,
                contact.ProspectStage,
                contact.CountryCode,
                contact.RegistrationSource,
                contact.QualifiedForRewardsStore,
                contact.TCsVersionAccepted,
                contact.AccountNumber,
                contact.AccountDateTime,
                contact.TransactionValue,
                contact.CaseNumber,
                contact.LoanApplicationId,
                contact.NumberOfDependents,
                contact.Salary,
                contact.ApplicantIncome,
                contact.MonthlyIncome,
                contact.LoanAmount,
                contact.BalanceAmount,
                contact.TenureOfLoan,
                contact.CreditHistory,
                contact.CreditScore,
                contact.PropertyArea,
                contact.LoanStatus,
                contact.IsOwnHouse,
                contact.HasCreditCard,
                contact.IsActiveMember,
                contact.NumberOfAccountsHold,
                contact.StoryMessage,
                contact.Question,
                contact.QuestionID,
                contact.ApplicantId,
                contact.ProspectId,
                contact.AccountBranchName,
                contact.BureauType,
                contact.CityCategory,
                contact.CustomerId,
                contact.EcsActive,
                contact.EtpNtp,
                contact.SegmentType,
                contact.ContactSubSource,
                contact.AccountCardType,
                contact.AffluenceParameter,
                contact.AffluenceParameterRisk,
                contact.CustomField21,
                contact.CustomField22,
                contact.CustomField23,
                contact.CustomField24,
                contact.CustomField25,
                contact.CustomField26,
                contact.CustomField27,
                contact.CustomField28,
                contact.CustomField29,
                contact.CustomField30,
                contact.CustomField31,
                contact.CustomField32,
                contact.CustomField33,
                contact.CustomField34,
                contact.CustomField35,
                contact.CustomField36,
                contact.CustomField37,
                contact.CustomField38,
                contact.CustomField39,
                contact.CustomField40,
                contact.CustomField41,
                contact.CustomField42,
                contact.CustomField43,
                contact.CustomField44,
                contact.CustomField45,
                contact.CustomField46,
                contact.CustomField47,
                contact.CustomField48,
                contact.CustomField49,
                contact.CustomField50,
                contact.CustomField51,
                contact.CustomField52,
                contact.CustomField53,
                contact.CustomField54,
                contact.CustomField55,
                contact.CustomField56,
                contact.CustomField57,
                contact.CustomField58,
                contact.CustomField59,
                contact.CustomField60,
                contact.IsDeviceIdExists,
                contact.IsAdSenseOrAdWord,
                contact.LastModifyByUserId,
                contact.LmsGroupId,
                contact.Remarks,
                contact.ReminderDate,
                contact.ToReminderPhoneNumber,
                contact.ToReminderEmailId,
                contact.Score,
                contact.SearchKeyword,
                contact.PageUrl,
                contact.ReferrerUrl,
                contact.Place,
                contact.MailTemplateId,
                contact.MailAlertScheduleDate,
                contact.FromEmailId,
                contact.Subject,
                contact.FromName,
                contact.SmsTemplateId,
                contact.SmsAlertScheduleDate,
                contact.CustomSmsContent,
                contact.Address1,
                contact.Address2,
                contact.StateName,
                contact.ZipCode,
                contact.Religion,
                contact.DomainName,
                contact.CompanyName,
                contact.CompanyWebUrl,
                contact.CompanyAddress,
                contact.MailUnsubscribeDate,
                contact.SmsUnsubscribeDate,
                contact.UssdUnsubscribeDate,
                contact.Projects,
                contact.FormId,
                contact.AllFormIds,
                contact.ChatId,
                contact.AllChatIds,
                contact.IsNewLead,
                contact.EnquiryType,
                contact.CallStatus,
                contact.LostReason,
                contact.SiteVisitDate,
                contact.FloorPreference,
                contact.LocationPreference,
                contact.PreferenceHouseType,
                contact.ReasonForFollowUp,
                contact.PurchasePlanDate,
                contact.IsSiteVisitBooked,
                contact.IsSiteVisitCompleted,
                contact.IsWhatsAppOptIn,
                contact.WhatsAppConsentDate,
                contact.ScoreUpdatedDate,
                contact.LeadLabel,
                contact.FollowUpContent,
                contact.FollowUpStatus,
                contact.FollowUpDate,
                contact.FollowUpUserId,
                contact.FollowUpUpdatedDate,
                contact.LeadLabelUpdatedDate,
                contact.FollowUpCreatedDate,
                contact.HandledByUpdatedDate,
                contact.CreatedUserInfoUserId,
                contact.IsSourceMoved,
                contact.SourceMovedDate,
                contact.RepeatLeadCount,
                contact.CustomField61,
                contact.CustomField62,
                contact.CustomField63,
                contact.CustomField64,
                contact.CustomField65,
                contact.CustomField66,
                contact.CustomField67,
                contact.CustomField68,
                contact.CustomField69,
                contact.CustomField70,
                contact.CustomField71,
                contact.CustomField72,
                contact.CustomField73,
                contact.CustomField74,
                contact.CustomField75,
                contact.CustomField76,
                contact.CustomField77,
                contact.CustomField78,
                contact.CustomField79,
                contact.CustomField80,
                contact.CustomField81,
                contact.CustomField82,
                contact.CustomField83,
                contact.CustomField84,
                contact.CustomField85,
                contact.CustomField86,
                contact.CustomField87,
                contact.CustomField88,
                contact.CustomField89,
                contact.CustomField90,
                contact.CustomField91,
                contact.CustomField92,
                contact.CustomField93,
                contact.CustomField94,
                contact.CustomField95,
                contact.CustomField96,
                contact.CustomField97,
                contact.CustomField98,
                contact.CustomField99,
                contact.CustomField100
            };
            using var db = GetDbConnection(connection.Connection);

            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<IEnumerable<Contact>> GET(Contact contact, int FetchNext, int OffSetFetchIndex, int AgeRange1, int AgeRange2, string ContactListOfId, List<string> fieldName = null, bool? IsPhoneContact = null, int GroupId = 0)
        {
            string action = IsPhoneContact == null ? "GetAllContact" : !Convert.ToBoolean(IsPhoneContact) ? "GET" : "GETPhoneContacts";
            string filenames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string storeProcCommand = "Contact_Details";

            object? param = new
            {
                action,
                contact.ContactId,
                contact.EmailId,
                contact.PhoneNumber,
                contact.Gender,
                contact.MaritalStatus,
                contact.Education,
                contact.Occupation,
                contact.Interests,
                contact.Location,
                contact.IsVerifiedMailId,
                contact.IsVerifiedContactNumber,
                contact.LookedupStatus,
                contact.CustomField1,
                contact.CustomField2,
                contact.CustomField3,
                contact.CustomField4,
                contact.CustomField5,
                contact.CustomField6,
                contact.CustomField7,
                contact.CustomField8,
                contact.CustomField9,
                contact.CustomField10,
                contact.CustomField11,
                contact.CustomField12,
                contact.CustomField13,
                contact.CustomField14,
                contact.CustomField15,
                contact.CustomField16,
                contact.CustomField17,
                contact.CustomField18,
                contact.CustomField19,
                contact.CustomField20,
                FetchNext,
                OffSetFetchIndex,
                AgeRange1,
                AgeRange2,
                ContactListOfId,
                filenames,
                GroupId,
                contact.Unsubscribe,
                contact.ReferType,
                contact.USSDUnsubscribe,
                contact.IsSmsUnsubscribe,
                contact.OptInOverAllNewsLetter,
                contact.Country,
                contact.SmsOptInOverAllNewsLetter,
                contact.USSDOptInOverAllNewsLetter,
                contact.UtmTagSource,
                contact.FirstUtmMedium,
                contact.FirstUtmCampaign,
                contact.FirstUtmTerm,
                contact.FirstUtmContent
            };


            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Contact?> GetDetails(Contact contact, List<string> fieldName = null, bool IsPhoneContact = false)
        {
            string filenames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string action = !IsPhoneContact ? "GET" : "GETPhoneContacts";
            string storeProcCommand = "Contact_Details";
            object? param = new { action, contact.ContactId, contact.EmailId, contact.PhoneNumber, contact.Gender, contact.MaritalStatus, contact.Education, contact.Occupation, contact.Interests, contact.Location, contact.IsVerifiedMailId, contact.IsVerifiedContactNumber, contact.LookedupStatus, contact.CustomField1, contact.CustomField2, contact.CustomField3, contact.CustomField4, contact.CustomField5, contact.CustomField6, contact.CustomField7, contact.CustomField8, contact.CustomField9, contact.CustomField10, contact.CustomField11, contact.CustomField12, contact.CustomField13, contact.CustomField14, contact.CustomField15, contact.CustomField16, contact.CustomField17, contact.CustomField18, contact.CustomField19, contact.CustomField20, filenames, contact.Unsubscribe, contact.USSDUnsubscribe, contact.IsSmsUnsubscribe, contact.OptInOverAllNewsLetter, contact.SmsOptInOverAllNewsLetter, contact.USSDOptInOverAllNewsLetter, contact.UtmTagSource, contact.FirstUtmMedium, contact.FirstUtmCampaign, contact.FirstUtmTerm, contact.FirstUtmContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Contact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        public async Task<IEnumerable<Contact>> GetContactIds(List<Contact> contact, int OffSet, int FetchNext, List<string> fieldName, bool IsPhoneContact = false)
        {
            string action = !IsPhoneContact ? "GET" : "GETPhoneContacts";
            string emailidslist = string.Join(",", contact.Where(x => x.EmailId != null).Select(x => x.EmailId));
            string phonenumberlist = string.Join(",", contact.Where(x => x.PhoneNumber != null).Select(x => x.PhoneNumber));
            string memberidlist = string.Join(",", contact.Where(x => x.PhoneNumber != null).Select(x => x.PhoneNumber));
            string fieldNames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string storeProcCommand = "Contact_Details";
            object? param = new { action, OffSet, FetchNext, emailidslist, phonenumberlist, memberidlist, fieldNames };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Contact?> GetContactDetails(Contact contact, List<string> fieldName = null)
        {
            string fieldnames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "GetDetails", contact.ContactId, contact.EmailId, contact.PhoneNumber, fieldnames };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Contact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<Contact>> GetAllContactList(List<int> ContactIds, bool IsPhoneContact = false)
        {
            string action = !IsPhoneContact ? "GET" : "GETPhoneContacts";
            string contactids = string.Join(",", ContactIds);
            string storeProcCommand = "Contact_Details";

            object? param = new { action, contactids };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<IEnumerable<Groups>> BelongToWhichGroup(int ContactId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "BelongToWhichGroup", ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> UpdateVerification(int ContactId, int IsVerifiedMailId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "UpdateVerificationStatus", ContactId, IsVerifiedMailId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async Task<IEnumerable<MLContacts>> GetContactForVerification(int GroupId)
        {
            string storeProcCommand = "Contact_CustomDetails";

            object? param = new { Action = "GetAllEmailsForVerification", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLContacts>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> SearchAndAddtoGroup(int UserInfoUserId, int UserGroupId, Contact contact, int StartCount, int EndCount, int GroupId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            List<Contact> contactObject = new List<Contact>();
            contactObject.Add(contact);
            DataTable contacts = new DataTable();
            contacts = ToDataTables(contactObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in contacts.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            string storeProcCommand = "Mail_SearchAndAddtoGroup";
            object? param = new { Action = "InsertToRequestedGroup", UserInfoUserId, UserGroupId, StartCount, EndCount, FromDateTime, ToDateTime, GroupId, contacts };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> AddToUnsubscribeList(int[] contact)
        {
            bool isDataInserted = false;
            foreach (var eachContact in contact)
            {
                string storeProcCommand = "Contact_CustomDetails";

                object? param = new { Action = "AddToUnsubscribeList", eachContact };

                using var db = GetDbConnection(connection.Connection);
                isDataInserted = await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }
            return isDataInserted;
        }

        public async Task<bool> AddToSmsUnsubscribeList(int[] contact)
        {
            bool isDataInserted = false;
            foreach (var eachContact in contact)
            {
                string storeProcCommand = "Contact_CustomDetails";

                object? param = new { Action = "AddToSmsUnsubscribeList", eachContact };

                using var db = GetDbConnection(connection.Connection);
                isDataInserted = await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }
            return isDataInserted;
        }

        public async Task<bool> AddToInvalidateList(int[] contact)
        {
            bool isDataInserted = false;
            foreach (var eachContact in contact)
            {
                string storeProcCommand = "Contact_CustomDetails";
                object? param = new { Action = "AddToInvalidateList", eachContact };

                using var db = GetDbConnection(connection.Connection);
                isDataInserted = await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }
            return isDataInserted;
        }


        public async Task<bool> SmsUnSubscribe(string PhoneNumber)
        {
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "SmsUnSubscribe", PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        //For LmsLeads 

        public List<Contact> GetListByContactIdTable(DataTable CampaignContactId, List<string> fieldNames)
        {
            string storeProcCommand = "";
            object? param = new();
            string fieldname = fieldNames != null ? string.Join(",", fieldNames.Select(s => s.ToLowerInvariant()).ToArray()) : null;
            if (fieldNames != null)
            {
                storeProcCommand = "CampaignContact_Details";
                param = new
                {
                    Action = "Getlistbycontactidtablebyfieldname",
                    CampaignContactId,
                    fieldname
                };
            }
            else
            {
                storeProcCommand = "CampaignContact_Details";
                param = new
                {
                    Action = "GetListByContactIdTable",
                    CampaignContactId,
                    fieldname
                };
            }

            using var db = GetDbConnection(connection.Connection);
            return (db.Query<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<Int32> MaxCount(Contact contact, Int32? GroupId = null)
        {
            string storeProcCommand = "Contact_New_Details";
            object? param = new { Action = "ContactsCount", contact.EmailId, contact.PhoneNumber, GroupId, contact.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Contact>> GetAllContact(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null, List<string> fieldsName = null)
        {
            string storeProcCommand = "Contact_New_Details";
            object? param = new { Action = "ContactsData", FetchNext, OffSet, contact.EmailId, contact.PhoneNumber, GroupId, contact.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Contact?> GetContactDetailsByEmailIdPhoneNumber(Contact contact)
        {
            string storeProcCommand = "Contact_New_Details";
            object? param = new { Action = "GetContactDetailsByEmailIdPhoneNumber", contact.EmailId, contact.PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Contact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<Contact>> CheckEmailOrPhoneExistence(string EmailId, string PhoneNumber, List<string> FieldNames)
        {
            string FieldName = FieldNames != null ? string.Join(",", FieldNames.ToArray()) : null;
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "CheckEmailOrPhoneExistence", EmailId, PhoneNumber, FieldName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> FacebookContactsMaxCount(Contact contact, Int32? GroupId = null)
        {

            string storeProcCommand = "Contact_New_Details";
            object? param = new { Action = "FacebookContactsMaxCount", contact.EmailId, contact.PhoneNumber, GroupId, contact.Name, contact.FacebookUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Contact>> FacebookContactDetails(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null, List<string> fieldsName = null)
        {


            string storeProcCommand = "Contact_New_Details";
            object? param = new { Action = "FacebookContactDetails", FetchNext, OffSet, contact.EmailId, contact.PhoneNumber, GroupId, contact.Name, contact.FacebookUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> MakeItNotVerified(int ContactId, int IsVerifiedMailId)
        {
            return await UpdateVerification(ContactId, IsVerifiedMailId);
        }

        public async Task<Int32> CheckEmailIdPhoeNumberExists(string EmailId, string PhoneNumber)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "CheckContactDetailsForRepeatLead", EmailId, PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        private static DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                table.Columns.Add(prp.Name, Nullable.GetUnderlyingType(prp.PropertyType) ?? prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }

        public async Task<Contact?> GetContactDetailsAsync(Contact contact, List<string> fieldName = null)
        {
            string fieldnames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "GetDetails", contact.ContactId, contact.EmailId, contact.PhoneNumber, fieldnames };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateVerificationAsync(int ContactId, int IsVerifiedMailId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "UpdateVerificationStatus", ContactId, IsVerifiedMailId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateIsVerifiedMailId(int GroupId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "UpdateIsVerifiedMailId", GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<Int32> MailUnSubscribeMaxCount(int GroupId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "MailUNSCount", GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<Contact>> GetMailUnSubscribeDetails(int OffSet, int FetchNext, int GroupId)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "MailUNSGetDetails", OffSet, FetchNext, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param);
        }
        public async Task<bool> UpdateMailUnSubscribedContact(int contactid)
        {
            string storeProcCommand = "Contact_CustomDetails";
            object? param = new { Action = "UpdateMailUnsub", contactid };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
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
