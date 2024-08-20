using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserGroup : IDisposable
    {
        Task<Int32> Save(MLUserGroup userGroup);
        Task<bool> SavePermissions(int[] permissionsList, int UserGroupId);
        Task<bool> DeleteSavedGroupPermissions(int[] permissionsList, int UserGroupId);
        Task<bool> Update(MLUserGroup userGroup);
        Task<int> GetUserGroupPermissionsCount(string UserGroupName, int UserInfoUserId);
        Task<List<MLUserGroupWithHierarchy>> GetUserGroupPermissionsList(string UserGroupName, int OffSet, int FetchNext, int UserInfoUserId);
        Task<List<MLUserGroup>> GetUserGroupPermissionsToBind(MLUserGroup userGroup);
        Task<bool> DeleteUserGroupPermissions(int Id);
        Task<Int32> InsertUserGroupsAccount(MLUserGroup userGroup, int AccountId);
        Task<Int32> DeleteUserGroupsAccount(MLUserGroup userGroup);
        Task<List<UserAccounts>> GetGroupAccounts(int UserGroupId);
        Task<Int32> DeleteUserFromGroup(MLUserGroup userGroup);
        Task<Int32> AddMemberstoGroup(MLUserGroup userGroup);
        Task<List<UserInfo>> GetGroupMembers(int GroupId);
        Task<List<UserGroup>> GetUserGroup(int UserInfoUserId);
        Task<List<UserGroup>> GetUserGroupList();
        Task<List<UserGroup>> GetUserGroups(int UserInfoUserId);
    }
}
