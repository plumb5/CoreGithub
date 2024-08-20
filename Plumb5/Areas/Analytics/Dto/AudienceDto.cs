namespace Plumb5.Areas.Analytics.Dto
{
    public record GetVisitorsReportCountDto(int accountId, int duration, string fromdate, string todate, string drpSearchBy = "", string txtSearchBy = "");
    public record BindVisitorsDto(int accountId, int duration, string fromdate, string todate, int start, int end, string drpSearchBy = "", string txtSearchBy = "");
    public record BindFilterValuesDto(int accountId, int duration, string fromdate, string todate, string drpSearchBy = "", string txtSearchBy = "");
    public record VisitorsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

    public record NetworkReportDto(int accountId, int duration, string fromdate, string todate, int endcount, int startcount);
    public record NetworkReportCountDto(int accountId, int duration, string fromdate, string todate);
    public record NetworkExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

    public record DeviceReportCountDto(int accountId, int duration, string fromdate, string todate);
    public record DeviceReportDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record DeviceExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record BrowserReportCountDto(int accountId, int duration, string fromdate, string todate);
    public record BrowserReportDto(int AccountId, int duration, string fromdate, string todate, int start, int end);
    public record BrowserExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetPageDepthDto(int AccountId, string fromdate, string todate, int duration);
    public record PageDepthExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetTimeSpendDto(int AccountId, string fromdate, string todate, int duration);
    public record TimeSpendExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetCitiesDto(int AccountId, string fromdate, string todate, int start, int end, int duration);
    public record GetCityMapDataDto(int AccountId, string fromdate, string todate, int duration);
    public record GetCityMaxCountDto(int AccountId, string fromdate, string todate, int duration);
    public record WebCityExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetFrequencyReportDto(int AccountId, string fromdate, string todate, int duration);
    public record FrequencyExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetRecencyDto(int AccountId, int OffSet, int FetchNext);
    public record RecencyExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record GetRecencyReturningDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record AutoSuggestDto(int accountId, string type, string q, int limit);
    public record SearchByOnclickDto(int accountId, string drpSearchBy, string txtSearchBy, int duration, string fromdate, string todate, int start, int end, int visitorSummary = 0);
    public record GetGroupNamesDto(int accountId);
    public record AddToGroupDto(int accountId, string contact, string machine, int groupId);
    public record UpdateScoreDto(int accountId, string mac, string key);
    public record TransactionDto(int accountId);
}
