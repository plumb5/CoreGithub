using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record PublisherReportDto_GetUser(int accountId, int Getallusers);
    public record PublisherReportDto_GetMaxCount(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, string UserinfoName, int OrderbyVal, string Stagename);
    public record PublisherReportDto_GetReport(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, int OffSet, int FetchNext, string UserinfoName, int OrderbyVal, string Stagename);
    public record PublisherReportDto_GetSourceReport(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, int OffSet, int FetchNext, string UserinfoName, int OrderbyVal);
    public record PublisherReportDto_GetStageScore(int accountId);
    public record PublisherReportDto_PublisherReportExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record PublisherReportDto_ExportSourceReport(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
