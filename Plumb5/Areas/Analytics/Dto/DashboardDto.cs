using Microsoft.Identity.Client;
using P5GenralML;

namespace Plumb5.Areas.Analytics.Dto
{
    public record Dashboard_VisitsReportDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_WebSessionExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, string FileType);
    public record Dashboard_VisitsReportCompareDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_CountryReportDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record Dashboard_CountryMapDataDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_CountryReportMaxCountDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_WebCountryExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Dashboard_NewVsReturnReportDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_WebNewReturnExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, string FileType);
    public record Dashboard_TimeOnSiteReportDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_TimeOnSiteReportExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Dashboard_VisitorsTimeTrendsDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_VisitorsTimeTrendsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Dashboard_OverallDataDto(int accountId, int duration, string fromdate, string todate);
    public record Dashboard_OverallPercentageDto(int accountId, int duration, string fromdate, string todate);

}
