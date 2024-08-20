using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record NotificationRules_GetNotificationRulesMaxCount(int AdsId, string rulesName = null);
    public record NotificationRules_GetNotificationRules(int AdsId, int OffSet, int FetchNext, string rulesName = null);
    public record NotificationRules_SaveContactNotificationRule(int AccountId, ContactNotificationRule contactNotificationrule, MailSendingSetting mailSendingSetting, SmsSendingSetting smsSendingSetting, WhatsAppSendingSetting whatsAppSendingSetting);
    public record NotificationRules_GetRules(int AccountId);
    public record NotificationRules_GetRulesForEdit(int AccountId, int RuleId);
    public record NotificationRules_Delete(int AdsId, int Id);
    public record NotificationRules_ToggleStatus(int AdsId, int Id, bool Status);
    public record NotificationRules_ChangePriority(int AdsId, List<ContactNotificationRule> contactNotificationRules);
    public record NotificationRules_GetLMSGroupList(int accountId);
}
