using P5GenralML;

namespace Plumb5.Areas.Dashboard.Dto
{  

    public record DashboardMailAlert_GetJsonContentDto(string Guid);
    public record DashboardMailAlert_FormResponseAllExportDto(string UserIdString, string AccountId, string FromDate, string ToDate);

}
