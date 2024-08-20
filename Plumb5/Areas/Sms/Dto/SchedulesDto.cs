namespace Plumb5.Areas.Sms.Dto
{
    public record SchedulesDto_GetMaxCount(string fromDateTime, string toDateTime, string CampignName = null);
    public record SchedulesDto_ShowSetSchedule(int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampignName = null);
    public record SchedulesDto_ExportScheduleCampaign(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record SchedulesDto_Export(int OffSet, int FetchNext, string FileType);
}
