namespace Plumb5.Areas.Analytics.Dto
{
    public record Traffic_AllSourcesReportDto(int accountId, int duration, string fromdate, string todate);
    public record Traffic_AllSourcesExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_ReferringTrafficReport(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record Traffic_ReferringTrafficReportCount(int accountId, int duration, string fromdate, string todate);
    public record Traffic_ReferringTrafficExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_SearchTrafficReportCount(int accountId, string fromdate, string todate);
    public record Traffic_SearchTrafficReport(int accountId, string fromdate, string todate, int start, int end);
    public record Traffic_ExportSearchTrafficReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_SearchSourcePages(int accountId, string fromdate, string todate, string Source, int start, int end, string Type);
    public record Traffic_SearchKeyReport(int accountId, string fromdate, string todate, string Source, int start, int end, string page);
    public record Traffic_PaidCampaignsReportCount(string Action, int accountId, string fromdate, string todate, string QuickFilterBy);
    public record Traffic_GetDropDownReady(int accountId);
    public record Traffic_PaidCampaignsReport(string Action, int accountId, string fromdate, string todate, int start, int end, string QuickFilterBy);
    public record Traffic_UtmTagsExportReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_AdWordsExportReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_AdSenseExportReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_SocialTrafficReportCount(int accountId, string fromdate, string todate);
    public record Traffic_SocialSourceReport(int accountId, string fromdate, string todate, int start, int end);
    public record Traffic_SocialSourceReportExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_OverallPercentage(int accountId, int duration, string fromdate, string todate, int compare);
    public record Traffic_SaveAttributionSetting(int accountId, string modelName, string pageName);
    public record Traffic_AttributionReportCount(int accountId, string fromdate, string todate);
    public record Traffic_AttributionReport(int accountId, string fromdate, string todate, int start, int end);
    public record Traffic_AttributionDelete(int accountId, int attributionId);
    public record Traffic_BindModelViewReport(int accountId, string fromdate, string todate, int modelId, string key);
    public record Traffic_BindVisitorsFlow(int accountId, int duration, string fromdate, string todate, string key);
    public record Traffic_BindUserVisitorsFlow(int Interaction, string key, string Pages, string MachineId);
    public record Traffic_AllSourcesReportCompare(int accountId, int duration, string fromdate, string todate);
    public record Traffic_EmailSmsReport(int accountId, int duration, string fromdate, string todate, string key);
    public record Traffic_ExportEmailSmsReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Traffic_AddLandingPage(int accountId, string LandingPage, string Mode);
}
