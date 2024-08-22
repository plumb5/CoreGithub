using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record Settings_SaveSettingsDto(int accountId, FacebookAssignmentSettings AssignmentSettings);
    public record Settings_GetSettingsDto(int accountId, int PageIndex, FacebookAssignmentSettings AssignmentSettings);
    public record Settings_GetGroupListDto(int accountId);
    public record Settings_GetUserListDto(int accountId, int UserId);
    public record Settings_GetUserGroupListDto(int accountId);
    public record Settings_RemoveAccessTokenDto(int accountId);
    public record Settings_LmsGroupsListDto(int accountId);
}
