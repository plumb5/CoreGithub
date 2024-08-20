using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailEffectivenessReportDto_MaxCount(int accountId, MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport, string fromDateTime, string toDateTime);
    public record MailEffectivenessReportDto_GetReportDetails(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport, int OffSet, int FetchNext);
    public record MailEffectivenessReportDto_Export(int OffSet, int FetchNext, string FileType);
}
