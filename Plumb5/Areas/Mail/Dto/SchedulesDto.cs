using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record Schedules_GetMaxCountDto(string fromDateTime, string toDateTime, string CampignName = null);
    public record Schedules_ShowSetScheduleDto(int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampignName = null);
    public record Schedules_DeleteDto(Int16 Id);
    public record Schedules_ExportDto(string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Schedules_UpdateScheduledDripDto(MailDrips mailDrips);
}
