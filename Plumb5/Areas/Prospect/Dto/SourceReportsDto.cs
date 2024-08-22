namespace Plumb5.Areas.Prospect.Dto
{
    public record SourceReportsDto_GetMaxCount(int accountId, string fromDateTime, string toDateTime, int UserInfoUserId, bool IsCreatedDate);
    public record SourceReportsDto_GetReport(int accountId, string fromDateTime, string toDateTime, int Offset = 0, int FetchNext = 20, int UserInfoUserId = 0, bool IsCreatedDate = true);
    public record SourceReportsDto_ExportSourceReport(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
