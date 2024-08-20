using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Dto
{
    public record RevenueSettings_GetEventnamesDto(int accountId);
    public record RevenueSettings_GetEventExtraFieldDataDto(int accountId, int customEventOverViewId);
    public record RevenueSettings_SaveRevenueDto(int accountId, string Currency, string RevenueSettings);
    public record RevenueSettings_GetRevenueSettingsDataDto(int accountId);
}
