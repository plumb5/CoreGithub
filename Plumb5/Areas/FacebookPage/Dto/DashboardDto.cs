using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record Dashboard_GetDashboardDetailsDto(string TimeDuration, int PageIndex);
    public record Dashboard_GetPageContentDto(string TimeDuration, int PageIndex);
}
