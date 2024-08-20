using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPermissionsLevel : IDisposable
    {
        Task<Int32> Save(PermissionsLevels permissionslevel);
        Task<bool> Update(PermissionsLevels permissionslevel);
        Task<int> GetMaxCount(int MainUserId, string? RoleName = null);
        Task<List<PermissionsLevels>> GetPermissionsList(int OffSet, int FetchNext, int MainUserId, string? RoleName = null);
        Task<bool> Delete(int Id);
        Task<PermissionsLevels?> GetPermission(int PermissionId, int MainUserId);
        Task<List<PermissionsLevels>> BindGroupsContact(MLUserGroup userGroup, int OffSet, int FetchNext);
        Task<PermissionsLevels?> UserPermission(int UserInfoUserId);
        Task<PermissionsLevels?> UserPermissionbyAccountId(int UserInfoUserId, int AccountId);
        Task<List<PermissionsLevels>> GetRoles(int MainUserId);
        Task<List<PermissionsLevels>> GetRolesByIds(List<int> PermissionLevelIds);
    }
}
