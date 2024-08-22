using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailTemplateArchive_GetArchiveMaxCountDto(int AdsId, MailTemplate mailTemplate);
    public record MailTemplateArchive_GetArchiveTemplateListDto(int AdsId, MailTemplate mailTemplate, int FetchNext, int OffSet);
    public record MailTemplateArchive_Export(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MailTemplateArchive_RestoreMailTemplate(int AdsId, int Id);

}
