using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record Report_GetMaxCountDto(int accountId, string fromDateTime, string toDateTime, string CampaignName, string TemplateName, int WhatsAppSendingSettingId = 0);
    public record Report_GetReportDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampaignName, string TemplateName, int WhatsAppSendingSettingId = 0);
    public record Report_GetCampaignResponseDataDto(int AdsId, int SendingSettingId, string FileType);
    public record Report_ExportWhatsAppCampaignReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Report_AddCampaignToGroupsDto(int[] WhatsAppSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
    public record Report_RemoveCampaignFromGroupDto(int[] WhatsAppSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
}
