namespace Plumb5.Areas.Sms.Dto
{
    public record ReportDto_GetMaxCount(int accountId, string fromDateTime, string toDateTime, string CampaignName, string TemplateName);
    public record ReportDto_GetReportData(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampaignName, string TemplateName);
    public record ReportDto_GetCampaignResponseData(int AdsId, int SendingSettingId, string FileType);
    public record ReportDto_ExportSmsCampaignReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ReportDto_AddCampaignToGroups(int[] SmsSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
    public record ReportDto_RemoveCampaignFromGroup(int[] SmsSendingSettingIdList, int GroupId, int[] CampaignResponseValue);
}
