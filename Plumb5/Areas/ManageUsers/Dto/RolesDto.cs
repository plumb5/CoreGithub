using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.ManageUsers.Dto
{
    public record Roles_GetMaxCountDto(string RolesName);
    public record Roles_GetPermissionsListDto(string RolesName, int OffSet, int FetchNext);
    public record Roles_DeleteDto(int Id);
    public record Roles_SaveOrUpdateDetailsDto(PermissionsLevels permissionsleveldata, List<PermissionSubLevels> permissionSubLevelsListData, int PermissionLevelId, bool IsViewOnly);
    public record Roles_GetPermissionDto(PermissionsLevels permissionsleveldata);


}
