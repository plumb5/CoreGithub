using P5GenralML;

namespace Plumb5.Areas.Analytics.Dto
{
    public record GetSavedReportsDto(int AccountId, int UserId);
    public record DeleteSavedSearchDto(int AccountId, int Id);
    public record GetFilterConditionDetailsDto(int AccountId, int FilterConditionId);
    public record GetMaxCountDto(int AccountId, AnalyticCustomReports? filterLead, string Groupby, string FromDateTime, string ToDateTime);
    public record GetAnalyticSaveReportsDto(int AccountId, AnalyticCustomReports? filterDataJson, string Groupby, int OffSet, int FetchNext, string FromDateTime, string ToDateTime);
    public record SaveReportDto(int accountId, AnalyticReports? analyticReports);
    public record AnalyticsReportExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

}
