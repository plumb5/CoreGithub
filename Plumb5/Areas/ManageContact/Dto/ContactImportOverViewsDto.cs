using Microsoft.AspNetCore.Mvc;
using Plumb5.Areas.CustomEvents.Dto;

namespace Plumb5.Areas.ManageContact.Dto
{
    
    public record ContactImportOverViews_GetMaxCountDto(int accountId, string fromDateTime, string toDateTime);
    public record ContactImportOverViews_GetAllDetailsDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record ContactImportOverViews_GetContactImportOverViewDetailsDto(int accountId, int ContactImportOverviewId);
    public record ContactImportOverViews_SampleContactFileForImportDto(int AccountId, List<string> Columns, bool IsExtraFieldNeed = false);
    public record ContactImportOverViews_ContactRejectFileExportDto(int AccountId, int ImportId, string FileType);
    public record ContactImportOverViews_ContactMergeFileExportDto(int AccountId, int ImportId, string FileType);
    public record ContactImportOverViews_CheckContactSettingDto(int AccountId);
    public record ContactImportOverViews_ContactImportOverViewsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
