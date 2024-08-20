using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Net;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record FtpImportSettings_MaxCountDto(int accountId);
    public record FtpImportSettings_GetDetailsDto(int accountId, int OffSet, int FetchNext);
    public record FtpImportSettings_SaveOrUpdateDetailsDto(int accountId, FtpImportSettings FtpImportSettings);
    public record FtpImportSettings_DeleteDto(int accountId, int Id);
    public record FtpImportSettings_GetFtpImportSettingsDetailsForUpdateDto(int AccountId, int Id);
    public record FtpImportSettings_TestConnectionDto(string ServerIp, string UserId, string Password, string Protocol);
    public record FtpImportSettings_GetFTPConnectionListDto(int accountId);
    public record FtpImportSettings_GetFtpDirectoryDto(int accountId, int connectionId, string path = null);
    
}
