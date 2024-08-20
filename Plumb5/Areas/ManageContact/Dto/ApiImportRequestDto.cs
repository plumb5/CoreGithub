namespace Plumb5.Areas.ManageContact.Dto;

public record ApiImportRequest_GetApiNames(int AccountId);
public record ApiImportRequest_GetMaxCount(int AccountId, string FromDateTime, string ToDateTime, string Requestcontent = null, string Name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null);
public record ApiImportRequest_GetDetails(int AccountId, string FromDateTime, string ToDateTime, string Requestcontent = null, string Name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null, int offset = 0, int fetchnext = 10);
public record ApiImportRequest_Export(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

