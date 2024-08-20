using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record ScheduleCampaignDto_GetSmsSendingSettingDetails(int accountId, int SmsSendingSettingId);
    public record ScheduleCampaignDto_GetScheduledMultiBatchDetails(int accountId, int SmsSendingSettingId);
    public record ScheduleCampaignDto_GetCampaignList(int accountId);
    public record ScheduleCampaignDto_GetUniquePhoneContact(int accountId, string ListOfGroupId);
    public record ScheduleCampaignDto_CheckIdentifierUniqueness(int accountId, string IdentifierName);
    public record ScheduleCampaignDto_GetGroupAnalysisDetails(int accountId, string GroupIds);
    public record ScheduleCampaignDto_GroupCreateAndMergeContact(int accountId, string ListOfGroupId, Groups groupDetails);
    public record ScheduleCampaignDto_SendIndividualTestSMS(int accountId, int SmsTemplateId, string PhoneNumber, bool IsPromotionalOrTransactionalType, int SmsConfigurationNameId, string MessageContent = null, List<SmsTemplateUrl> smsUrlList = null, bool? ConvertLinkToShortenUrl = null);
    public record ScheduleCampaignDto_SendGroupTestSMS(int accountId, SmsSendingSetting smsSendingSetting);
    public record ScheduleCampaignDto_SaveSingleScheduleSMS(int accountId, SmsSendingSettingDto smsSendingSetting, string EditCopyAction);
    public record ScheduleCampaignDto_SaveMultiBatchScheduleSMS(int accountId, SmsSendingSetting smsSendingSetting, List<SmsBulkSentTimeSplitSchedule> smsTimeSplitScheduled, string EditCopyAction);
    public record ScheduleCampaignDto_DeleteCampaign(int accountId, int SmsSendingSettingId);
    public record ScheduleCampaignDto_CheckCredits(int accountId, int TotalContacts);
}
