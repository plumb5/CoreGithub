using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailCampaignResponseReport_MaxCountDto(int accountId, MLMailCampaignResponseReport sentContactDetails, string fromDateTime, string toDateTime);
    public record MailCampaignResponseReport_GetMaxClickCountDto(int accountId, MLMailCampaignResponseReport sentContactDetails, string fromDateTime, string toDateTime);
    public record MailCampaignResponseReport_GetReportDetails(int accountId, MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record MailCampaignResponseReport_GetClickReportDetails(int accountId, MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record MailCampaignResponseReport_ExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
    public record MailCampaignResponseReport_ExportClickReport(int AccountId, int OffSet, int FetchNext, string FileType);
    public record MailCampaignResponseReport_ExportSentOpenOptOutBounceErrorReport(int AccountId, int OffSet, int FetchNext, string FileType);
    public record MailCampaignResponseReport_GetBouncedDetails(int MailSendingSettingId);


}
