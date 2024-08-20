namespace Plumb5.Areas.WebPush.Dto
{
    public record ReportDto_GetCampaignIdentifier(int accountId);
    public record ReportDto_GetGroupList(int accountId);
    public record ReportDto_GetMaxCount(int accountId, string fromDateTime, string toDateTime, string CampaignName);
    public record ReportDto_GetReportData(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampaignName);
    public record ReportDto_ExportWebPushCampaignReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ReportDto_AddCampaignToGroups(int accountId, int[] WebPushSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
    public record ReportDto_RemoveCampaignFromGroup(int accountId, int[] WebPushSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
    public record ReportDto_GetCampaignResponseData(int AdsId, int SendingSettingId, string FileType);
}
