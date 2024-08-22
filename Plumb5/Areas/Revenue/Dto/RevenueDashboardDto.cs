using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Dto
{
    public record RevenueDashboard_GetFieldsNameDto(int accountId);
    public record RevenueDashboard_MaxCountDto(int accountId, int customeventoverviewid, string fromDateTime, string toDateTime);
    public record RevenueDashboard_GetDetailsDto(int accountId, int customeventoverviewid, string fromDateTime, string toDateTime, int OffSet, int FetchNext, string BindType);
    public record RevenueDashboard_ExportDashboardReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
