namespace Plumb5.Areas.Prospect.Dto
{
    public record ContactArchiveDto_GetMaxCount(int accountId, int UserId, string fromDateTime, string toDateTime);
    public record ContactArchiveDto_GetReportData(int accountId, int UserId, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record ContactArchiveDto_GetContactImportOverViewDetails(int accountId, int LmsContactRemoveOverviewId);
    public record ContactArchiveDto_SampleCSVFileForImport(int AdsId, List<string> Columns);
    public record ContactArchiveDto_GetContactImportRejectDetailsCount(int AdsId, int LmsContactRemoveOverViewId);
    public record ContactArchiveDto_GetContactImportRejectDetails(int AdsId, int LmsContactRemoveOverViewId, int OffSet, int FetchNext);
    public record ContactArchiveDto_DownloadArchive(int accountId, int LmsContactRemoveOverviewId, string ImportedFileName);
    public record ContactArchiveDto_ContactArchiveExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

}
