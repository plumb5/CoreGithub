using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUserGroupPG : CommonDataBaseInteraction, IDLUserGroup
    {
        CommonInfo connection;

        public DLUserGroupPG()
        {
            connection = GetDBConnection();
        }

        public DLUserGroupPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> Save(MLUserGroup userGroup)
        {
            string storeProcCommand = "select user_group_save(@Name, @UserGroupDescription, @UserGroupId, @UserInfoUserId, @CreatedByUserId)";
            object? param = new { userGroup.Name, userGroup.UserGroupDescription, userGroup.UserGroupId, userGroup.UserInfoUserId, userGroup.CreatedByUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> SavePermissions(int[] permissionsList, int UserGroupId)
        {
            bool isDataInserted = false;
            foreach (var eachContact in permissionsList)
            {
                string storeProcCommand = "select usergroup_permissions_save(@eachContact, @UserGroupId)";
                object? param = new { eachContact, UserGroupId };

                using var db = GetDbConnection(connection.Connection);
                await db.ExecuteScalarAsync<int>(storeProcCommand, param);

                isDataInserted = true;
            }
            return isDataInserted;
        }

        public async Task<bool> DeleteSavedGroupPermissions(int[] permissionsList, int UserGroupId)
        {
            string storeProcCommand = "select usergroup_permissions_delete(@PermissionsList,@UserGroupId)";
            object? param = new { PermissionsList = string.Join(",", permissionsList.ToArray()), UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Update(MLUserGroup userGroup)
        {
            string storeProcCommand = "select user_group_update(@Id, @Name, @UserGroupDescription, @UserGroupId)";
            object? param = new { userGroup.Id, userGroup.Name, userGroup.UserGroupDescription, userGroup.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<int> GetUserGroupPermissionsCount(string UserGroupName, int UserInfoUserId)
        {
            string storeProcCommand = "select user_group_maxcount(@UserInfoUserId, @UserGroupName)";
            object? param = new { UserInfoUserId, UserGroupName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<MLUserGroupWithHierarchy>> GetUserGroupPermissionsList(string UserGroupName, int OffSet, int FetchNext, int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_group_get(@UserInfoUserId, @UserGroupName, @OffSet, @FetchNext)";
            object? param = new { UserInfoUserId, UserGroupName, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserGroupWithHierarchy>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLUserGroup>> GetUserGroupPermissionsToBind(MLUserGroup userGroup)
        {
            string storeProcCommand = "select * from user_group_getusergrouppermissiontobind(@Id)";
            object? param = new { userGroup.Id };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserGroup>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> DeleteUserGroupPermissions(int Id)
        {
            string storeProcCommand = "select user_group_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> InsertUserGroupsAccount(MLUserGroup userGroup, int AccountId)
        {
            string storeProcCommand = "select user_group_insertusergroupsaccount(@Id,@AccountId)";
            object? param = new { userGroup.Id, AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> DeleteUserGroupsAccount(MLUserGroup userGroup)
        {
            string storeProcCommand = "select user_group_deleteusergroupsaccount(@Id)";
            object? param = new { userGroup.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<UserAccounts>> GetGroupAccounts(int UserGroupId)
        {
            string storeProcCommand = "select * from user_group_getgroupaccounts(@UserGroupId)";
            object? param = new { UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserAccounts>(storeProcCommand, param)).ToList();
        }

        public async Task<Int32> DeleteUserFromGroup(MLUserGroup userGroup)
        {
            string storeProcCommand = "select user_group_deleteusergroupsaccount(@UserInfoUserId,@UserGroupId)";
            object? param = new { userGroup.UserInfoUserId, userGroup.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> AddMemberstoGroup(MLUserGroup userGroup)
        {
            string storeProcCommand = "select user_group_addmemberstogroup(@UserInfoUserId,@UserGroupId)";
            object? param = new { userGroup.UserGroupId, userGroup.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<UserInfo>> GetGroupMembers(int GroupId)
        {
            string storeProcCommand = "select user_group_addmemberstogroup(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<List<UserGroup>> GetUserGroup(int UserInfoUserId)
        {
            string storeProcCommand = "select * from usergroup_details_getusergroups(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserGroup>(storeProcCommand, param)).ToList();
        }

        public async Task<List<UserGroup>> GetUserGroupList()
        {
            string storeProcCommand = "select * from user_group_getlist()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserGroup>(storeProcCommand)).ToList();
        }

        public async Task<List<UserGroup>> GetUserGroups(int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_group_getusersgroup(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserGroup>(storeProcCommand, param)).ToList();
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
