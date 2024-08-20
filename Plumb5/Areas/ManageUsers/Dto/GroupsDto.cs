using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.ManageUsers.Dto
{
    public record Groups_GetMaxCountDto(string UserGroupName);
    public record Groups_GetUserGroupListDto(string UserGroupName, int OffSet, int FetchNext);
    public record Groups_DeleteUserGroupDto(int UserGroupId);
    public record Groups_SaveOrUpdateGroupDto(MLUserGroup userGroup, int[] Accounts, int[] permissionsList);
    public record Groups_GetPermissionsListDto(int OffSet, int FetchNext);
    public record Groups_GetUserGroupToEditDto(MLUserGroup userGroup);
    public record Groups_GetGroupAccountsToEditDto(int UserGroupId);
}
