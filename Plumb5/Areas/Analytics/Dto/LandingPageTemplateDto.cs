using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Analytics.Dto
{
    public record LandingPageTemplate_GetLandingPageConfigurationDto(int AdsId);
    public record LandingPageTemplate_SaveStaticFilesDto(int accountId, int LandingPageId, int GalleryTemplateId);
    public record LandingPageTemplate_SaveUploadedTemplateDto(int accountId, LandingPage landingPage);
    public record LandingPageTemplate_SaveOrUpdateLandingPageDto(int AdsId, LandingPage landingPage);
    public record LandingPageTemplate_VerifyLandingPageDto(string CNAME, string LPNAME);
}
