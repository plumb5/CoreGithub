using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record ManageEmbeddedForms_GetMaxCount(int accountId, FormDetails? formDetails);
    public record ManageEmbeddedForms_GetAllDetails(int accountId, FormDetails formDetails, int OffSet, int FetchNext);
    public record ManageEmbeddedForms_Delete(int accountId, Int16 Id);
    public record ManageEmbeddedForms_CopyFormDetails(int accountId, int Id);
    public record ManageEmbeddedForms_EmbeddedFormsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ManageEmbeddedForms_ChangePriority(int AccountId, List<FormDetails> formdetails);
    public record ManageEmbeddedForms_SaveFormDetails(int AccountId, FormDetailsDto formdetails, List<FormFieldsBindingDetails> formfieldbindingdetails, List<FormFields> allFormFields, FormRulesDto rulesData, FormResponseReportToSetting responseSettings, int responseMailSettingFieldIndex, int responseSMSSettingFieldIndex, int responseMailOutSettingIndex, int responseSalesAssigmentSettingIndex, List<MailSendingSetting> mailSettingList, List<SmsSendingSetting> smsSettingList, int responseSmsOutSettingIndex, int responseRedirectUrlSettingIndex, int responseAutoAssignToGroupIndex, int responseReportToPhoneIndex, List<WebHookDetails> WebHookData, List<WhatsAppSendingSetting> WhatsAppSettingList, int responseWhatsAppOutSettingIndex, int responseWhatsAppSettingFieldIndex, List<int> AutoAssignToGroupIndexValues = null, List<string> DeletedWebhookId = null, List<string> RuleChecking = null, List<int> IsOverSourceIndexValues = null);
    public record ManageEmbeddedForms_GetFormDetails(int AccountId, int FormId);
    public record ManageEmbeddedForms_GetContactProperties(int accountId);
    public record ManageEmbeddedForms_DeleteField(int AccountId, Int16 Id);
}
