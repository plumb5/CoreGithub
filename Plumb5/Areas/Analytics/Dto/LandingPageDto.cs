using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Analytics.Dto
{
    public record LandingPage_GetMaxCountDto(int AdsId, string PageName = null);
    public record LandingPage_GetDetails(int AdsId, int FetchNext, int OffSet, string PageName = null);
    public record LandingPage_DeleteLandingPage(int AdsId, int Id);
    public record LandingPage_GetLandingPageConfiguration(int AdsId);
    public record LandingPage_SaveOrUpdateLandingPage(int AdsId, LandingPage landingPage);
    public record LandingPage_VerifyLandingPage(string CNAME, string LPNAME);
    public record LandingPage_DownloadLandingPage(int AdsId, int LandingPageId);
    public record LandingPage_DuplicateLandingPage(int AdsId, int SourceLPId, LandingPage landingPage);
    public record LandingPage_SaveLandingPageFile(int accountId, LandingPageTemplateFile TemplateFile);
    public record LandingPage_LandingPageExport(int AccountId, int OffSet, int FetchNext, string FileType);

}
