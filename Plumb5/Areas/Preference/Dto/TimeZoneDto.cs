using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Preference.Dto
{
    public record TimeZone_SaveTimeZoneDto(int AccountId, string TimeZoneName, string TimeZoneTitle);
    public record TimeZone_GetTimeZoneDto(int AccountId);
}
