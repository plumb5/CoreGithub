using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record Dashboard_GetTotalFormSubmissionsDto(int AccountId, string fromDateTime, string toDateTime);
    public record Dashboard_GetTopFivePerFormingFormsDto(int AccountId, string fromDateTime, string toDateTime);
    public record Dashboard_GetPlatformDistributionDto(int AccountId, string fromDateTime, string toDateTime);
    public record Dashboard_GetAggregateFormsDataDto(int AccountId, string fromDateTime, string toDateTime);
    public record Dashboard_GetFormReportDto(int FormId, int Duration, string fromDateTime, string toDateTime, bool IsBannerOrForm);
    public record Dashboard_BindFormImpressionsCountDto(int FormId, string fromDateTime, string toDateTime);
    public record Dashboard_Top5BannerResponsesDto(int FormId);
    public record Dashboard_GetFormMaxCountByReportDto(int AdsId, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId);
    public record Dashboard_GetFormByReportDto(int AdsId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId);
    public record Dashboard_GetFormDetailsByReportDto(int AdsId, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm);

}
