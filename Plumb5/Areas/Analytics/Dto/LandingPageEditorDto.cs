using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Analytics.Dto
{
    public record LandingPageEditor_GetJsonContentDto(int AccountId, int TemplateId);
    public record LandingPageEditor_UpdateTemplateContentDto(int AccountId, int TemplateId, string HtmlContent, string JsonContent, string pageName, int UserId, string ThankYouMessage);
}
