namespace Plumb5.Areas.Analytics.Dto
{
    public record SiteSearchOverView_IsDataExistsDto(int accountId);

    public record SiteSearchOverView_GetOverViewGraphDetailsDto(int accountId, string fromDateTime, string toDateTime);

    public record SiteSearchOverView_GetTopSearchedPageDto(int accountId, string fromDateTime, string toDateTime);

    public record SiteSearchOverView_GetTopSearchedTermDto(int accountId, string fromDateTime, string toDateTime);
}
