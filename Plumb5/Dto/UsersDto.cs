using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;

namespace Plumb5.Dto
{
    public record Users_SaveUserDetailsDto(UserInfo userInfoData, UserHierarchy userHierarchyData, int[] AccountIds, int[] GroupIds);
    public record Users_UpdateUserDetailsDto(UserInfo userInfoData, UserHierarchy userHierarchyData, int[] AccountIds, int[] GroupIds);
    public record Users_GetUserDetailDto(int UserId);
    public record Users_DeleteUserDetailsDto(int UserId);
    public record Users_GetUserDetailsDto(int UserGroupId, UserDetailsHierarchyWithPermissions userDetailsWithPermissions);
    public record Users_AddToGroupDto(int[] UserIds, int[] GroupIds);
    public record Users_RemoveFromGroupDto(int[] UserIds, int[] GroupIds);
    public record Users_ChangeStatusDto(int Id, bool Isactive);
    public record Users_GetUsersGroupDto(int Id);
    public record Users_RemoveUserfromGroupDto(int usergroupid, int userid);
    public record Users_UpdatePasswordDto(int UserId, string Password);
    public record Users_GetUserDto(int[] UserIds);
    public record Users_GetUsersBySeniorIdForTreeDto(int accountId, int UserId);
}
