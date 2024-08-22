using Microsoft.Identity.Client;
using P5GenralML;
namespace Plumb5.Areas.Analytics.Dto
{
    public record Uniques_UniqueVisitsReportMaxCountDto(int accountId, int duration, string fromdate, string todate, int start, int end, string type, string parameter, string action);
    public record Uniques_UniqueVisitsReportDto(int accountId, int duration, string fromdate, string todate, int start, int end, string type, string parameter, string action);
    public record Uniques_UniqueVisitsReportExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Uniques_CachedUniqueVisitsGetMaxCountDto(int accountId, string type, string parameter, string fromdate, string todate);
    public record Uniques_UniqueVisitsCachedReportDto(int accountId, string type, string parameter, string fromdate, string todate, int OffSet, int FetchNext);
    public record Uniques_DeviceUniqueVisitsReportMaxCountDto(int accountId, string fromdate, string todate, int start, int end, string DeviceId);
    public record Uniques_DeviceUniqueVisitsReportDto(int accountId, int duration, string fromdate, string todate, int start, int end, string DeviceId, string parameter, string action);
     
}
