using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Analytics.Dto
{
    public record GetTemplateDetails(int accountId, int LandingPageId);
    public record UpdateEditContent(int accountId, int LandingPageId, string HtmlContent, string PageName);
}
