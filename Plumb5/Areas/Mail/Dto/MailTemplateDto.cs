using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailTemplate_GetMailCampaignListDto(int accountId);
    public record MailTemplate_GetMaxCountDto(int AdsId, MailTemplate mailTemplate);
    public record MailTemplate_GetTemplateListDto(int AdsId, MailTemplate mailTemplate, int FetchNext, int OffSet);
    public record MailTemplate_DeleteDto(int AdsId, int Id);
    public record MailTemplate_GetArchiveTemplateDto(int accountId, string TemplateName, bool IsBeeTemplate);
    public record MailTemplate_UpdateArchiveStatusDto(int accountId, int Id);
    public record MailTemplate_SaveEditedTemplateDto(int accountId, MailTemplate mailTemplate);
    public record MailTemplate_DuplicateTemplateDto(int accountId, int SourceTemplateId, MailTemplate mailTemplate);
    public record MailTemplate_SaveMailTemplateFileDto(int accountId, MailTemplateFile TemplateFile);
    public record MailTemplate_GetAllTemplateListDto(int accountId);
    public record MailTemplate_GetTemplateDetailsDto(int accountId, int TemplateId);
    public record MailTemplate_GetMailCampaignDto(int AdsId);
    public record MailTemplate_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MailTemplate_CheckCounselorTagsDto(int accountId, int MailTemplateId);
}
