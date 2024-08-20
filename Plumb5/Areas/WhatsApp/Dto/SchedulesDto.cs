using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record Schedules_GetMaxCountDto(string fromDateTime, string toDateTime, string CampignName = null);
    public record Schedules_ShowSetScheduleDto(int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampignName = null);
    public record Schedules_ExportScheduleCampaignDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Schedules_UpdateScheduledDripDto(MailDrips mailDrips);
    public record Schedules_ExportDto(int OffSet, int FetchNext, string FileType);
}
