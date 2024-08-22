using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppTemplateArchive_GetCampaignListDto(int accountId);
    public record WhatsAppTemplateArchive_GetArchiveMaxCountDto(int AccountId, WhatsAppTemplates whatsAppTemplate);
    public record WhatsAppTemplateArchive_GetArchiveReportDto(int AccountId, WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext);
    public record WhatsAppTemplateArchive_UnArchiveDto(int AdsId, int Id);
    public record WhatsAppTemplateArchive_ArchiveReportExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
