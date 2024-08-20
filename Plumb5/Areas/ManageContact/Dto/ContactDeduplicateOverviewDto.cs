namespace Plumb5.Areas.ManageContact.Dto;

public record ContactDeduplicateOverview_GetMaxCount(int accountId, string fromDateTime, string toDateTime);
public record ContactDeduplicateOverview_GetDetails(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
public record ContactDeduplicateOverview_ManageDuplicateExport(int accountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
public record ContactDeduplicateOverview_SampleDeDuplicateContactFileForImport(int AccountId);
public record ContactDeduplicateOverview_DownLoadFileContent(int AccountId, int Id, string FileType, string ContactFileType);
public record ContactDeduplicateOverview_GetContactDeDuplicateImportOverViewDetails(int accountId, int Id);
public record ContactDeduplicateOverview_SaveImportedFileContent(int AccountId, int UserInfoUserId);

