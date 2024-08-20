using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.GoogleAds.Dto
{
    public record Overview_MaxCountDto(int accountId, string fromDateTime, string toDateTime, string Groupname);
    public record Overview_GetGoogleAdsDto(int AccountId, string googleaccountsid);
    public record Overview_GetReportDataDto(int accountId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, string Groupname);
    public record Overview_ExportGoogleAdsDataDto(string fromDateTime, string toDateTime, int OffSet, int FetchNext, string FileType);
    public record GetGroupsDetailsDto(int AccountId);
    public record Overview_SaveOrUpdateDetailsDto(int accountId, GoogleImportSettings googleimportsettings, string googleAudience, string googlediscription, string Googleaccountid);
    public record Overview_GetGooglAccountSettingsDetailsDto(int AdsId, int Id);
    public record Overview_DeleteGooglerecordDto(int accountId, int Id);
    public record Overview_ChangeStatusadwordsDto(int accountId, int Id);
    public record Overview_ResponsesMaxCountDto(int accountId, int Googleimportsettingsid, string fromDateTime, string toDateTime);
    public record Overview_GetGoogleAdsResponsesDto(int accountId, int Googleimportsettingsid, string fromDateTime, string toDateTime, int OffSet, int FetchNext);
    public record Overview_GetGoogleAdsResponseStatusDto(int AccountId, int Id, string googleresponsesname, string GoogleGroupId);
    public record Overview_ExportGoogleAdsResponsesDto(string fromDateTime, string toDateTime, int OffSet, int FetchNext, string FileType);
}
