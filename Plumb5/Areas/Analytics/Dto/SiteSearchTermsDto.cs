namespace Plumb5.Areas.Analytics.Dto
{
    public record SiteSearchTerms_GetSearchTermDto(int accountId, string fromDateTime, string toDateTime);
    public record SiteSearchTerms_SiteSearchTermExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
}
