using P5GenralML;
using Plumb5.Areas.ManageContact.Models;

namespace Plumb5.Areas.ManageContact.Dto;

public record ApiImportSettings_MaxCount(int accountId, string Name);
public record ApiImportSettings_GetDetails(int accountId, int OffSet, int FetchNext, string Name);
public record ApiImportSettings_SaveOrUpdateDetails(int accountId, ApiImportResponseSetting apiImportResponseSetting, List<MailSendingSetting> mailSendingSetting, List<MailSmsWhatsappOutResponderList> MailOutResponderList, bool IsMailConditional, List<SmsSendingSetting> smsSendingSetting, List<MailSmsWhatsappOutResponderList> SmsOutResponderList, bool IsSmsconditional, List<WhatsAppSendingSetting> whatsappSendingSetting, List<MailSmsWhatsappOutResponderList> WhatsappOutResponderList, bool Iswhatsappconditional);
public record ApiImportSettings_Delete(int accountId, int Id);
public record ApiImportSettings_ToggleStatus(int accountId, int Id, bool Status);
public record ApiImportSettings_SaveMailSendingSetting(int accountId, List<MailSendingSetting> mailSendingSetting, List<MailSmsWhatsappOutResponderList> MailOutResponderList);
public record ApiImportSettings_SaveSMSSendingSetting(int accountId, SmsSendingSetting smsSendingSetting);
public record ApiImportSettings_SaveWASendingSetting(int accountId, WhatsAppSendingSetting waSendingSetting);
public record ApiImportSettings_GetMailSendingSettingDetail(int accountId, int MailSendingSettingId);
public record ApiImportSettings_GetSMSSendingSettingDetail(int accountId, int SmsSendingSettingId);
public record ApiImportSettings_GetWASendingSettingDetail(int accountId, int WASendingSettingId);
public record ApiImportSettings_GetWebhookDetail(int accountId, int WebhookId);
public record ApiImportSettings_SaveOrUpdateWebhook(int accountId, WebHookDetails webHookDetails);
public record ApiImportSettings_GetMaxCountAPILogs(int AdsId, int ApiImportResponseSettingId);
public record ApiImportSettings_GetDetailsAPILogs(int AdsId, int ApiImportResponseSettingId, int OffSet, int FetchNext);
public record ApiImportSettings_GetUser(int accountId);