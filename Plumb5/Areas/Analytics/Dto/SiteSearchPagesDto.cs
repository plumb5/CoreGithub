namespace Plumb5.Areas.Analytics.Dto
{
    public record SiteSearchPages_GetSearchPageDto(int accountId, string fromDateTime, string toDateTime);

    public record SiteSearchPages_SiteSearchPagesExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
}
