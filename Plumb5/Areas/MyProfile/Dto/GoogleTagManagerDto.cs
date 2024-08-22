using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;

namespace Plumb5.Areas.MyProfile.Dto
{
    public record GoogleTagManager_GetGoogleAccessTokenDto(int accountId, string code);
    public record GoogleTagManager_GetGoogleAccountDto(int accountId);
    public record GoogleTagManager_GetGoogleContainersDto(int accountId, string accountpath);
    public record GoogleTagManager_GetGoogleWorkSpaceDto(int accountId, string containerpath);
    public record GoogleTagManager_GetGoogleTagsDto(int accountId, string workspcpath);
    public record GoogleTagManager_AddPlumb5TagDto(int accountId, string workspcpath, string sTagName, string domainName);
    public record GoogleTagManager_DeletePlumb5TagDto(int accountId, string Tagpath);
}
