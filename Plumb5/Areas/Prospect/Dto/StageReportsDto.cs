namespace Plumb5.Areas.Prospect.Dto
{
    public record StageReportsDto_GetMaxCount(int accountId, string fromDateTime, string toDateTime, int UserInfoUserId, bool IsCreatedDate);
    public record StageReportsDto_GetReport(int accountId, string fromDateTime, string toDateTime, int Offset = 0, int FetchNext = 20, int UserInfoUserId = 0, bool IsCreatedDate = true);
    public record StageReportsDto_ExportStageReport(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
