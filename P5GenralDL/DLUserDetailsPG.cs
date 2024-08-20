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
    public class DLUserDetailsPG : CommonDataBaseInteraction, IDLUserDetails
    {
        //private bool _disposed = false;
        //Get UserDetails By Email and Pwd ....
        CommonInfo connection;
        public DLUserDetailsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<UserInfo?> UserById(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getuserbyid(@UserInfoUserId)";
            object? param = new { MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param);
        }

        public async Task<List<UserDetail>> UsersbyMainUserId(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getusers(@MainUserId)";
            object? param = new { MlObj.MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserDetail>(storeProcCommand, param)).ToList();
        }

        public async Task<List<UserDetailswithSenior>> UserDetailswithSenior(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getuserswithsenior(@MainUserId)";
            object? param = new { MlObj.MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserDetailswithSenior>(storeProcCommand, param)).ToList();
        }

        public async Task SaveCreatedUserInfo(UserDetails MlObj)
        {
            string storeProcCommand = "select userdetails_insert(@MainUserId,@UserInfoUserId)";
            object? param = new { MlObj.MainUserId, MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> DeleteUser(UserDetails MlObj)
        {
            string storeProcCommand = "select userdetails_deleteuserbyid(@UserInfoUserId)";
            object? param = new { MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLUserHierarchy>> GetUsersByHierarchy(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getusersbyhierarchy(@MainUserId)";
            object? param = new { MlObj.MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLUserHierarchy>> GetUsersByGroups(UserDetails MlObj)
        {
            string UserGroupIdList = "";
            if (MlObj.GroupId != null && MlObj.GroupId.Count > 0)
                UserGroupIdList = string.Join(",", MlObj.GroupId.ToArray());

            string storeProcCommand = "select * from userdetails_getusersbygroups(@MainUserId,@UserGroupIdList)";
            object? param = new { MlObj.MainUserId, UserGroupIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param)).ToList();
        }

        public async Task<List<UserAccounts>> GetUsersAccount(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getaccounts(@MainUserId)";
            object? param = new { MlObj.MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserAccounts>(storeProcCommand, param)).ToList();
        }

        public async Task<UserDetails?> Get(int UserInfoUserId)
        {
            string storeProcCommand = "select * from userdetails_get(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserDetails?>(storeProcCommand, param);
        }


        public async Task<int> InsertHierarchy(UserDetails MlObj)
        {
            string storeProcCommand = "select userdetails_insert_userhierarchy(@MainUserId, @UserInfoUserId, @SeniorUserId, @AccountId, @CreatedByUserId, @PermissionLevelsId)";
            object? param = new { MlObj.MainUserId, MlObj.UserInfoUserId, MlObj.SeniorUserId, MlObj.AccountId, MlObj.CreatedByUserId, MlObj.PermissionLevelsId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<MLUserHierarchy?> GetUsersHierarchyByUserId(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getusersbyuserinfoid(@MainUserId,@UserInfoUserId)";
            object? param = new { MlObj.MainUserId, MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLUserHierarchy?>(storeProcCommand, param);
        }

        public async Task<List<UserAccounts>> GetUsersAccountbyUserId(UserDetails MlObj)
        {
            string storeProcCommand = "select * from userdetails_getusersaccountbyuserid(@MainUserId,@UserInfoUserId)";
            object? param = new { MlObj.MainUserId, MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserAccounts>(storeProcCommand, param)).ToList();
        }

        public async Task<int> DeleteHierarchy(UserDetails MlObj)
        {
            string storeProcCommand = "select userdetails_delete_userhierarchy(@UserInfoUserId)";
            object? param = new { MlObj.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLUserGroup>> GetUsersGroup(int UserId)
        {
            string storeProcCommand = "select * from user_group_getusersgroup(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserGroup>(storeProcCommand, param)).ToList();
        }

        public async Task<List<UserDetails>> GetUsersByCreatedUserId(int CreatedByUserId)
        {
            string storeProcCommand = "select * from userdetails_getusersbycreateduserid(@CreatedByUserId)";
            object? param = new { CreatedByUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<List<P5GenralML.MLUserHierarchyWithPermissions>> GetUserDetails(int UserId, int UserGroupId, UserDetailsHierarchyWithPermissions userDetailsWithPermissions)
        {
            const string storeProcCommand = "select * from userdetails_getusersdetails(@UserId,@EmailId,@UserGroupId,@ActiveStatus,@PermissionLevelsId,@SeniorUserId)";
            object? param = new { UserId, userDetailsWithPermissions.EmailId, UserGroupId = UserGroupId > 0 ? UserGroupId.ToString() : "", userDetailsWithPermissions.ActiveStatus, userDetailsWithPermissions.PermissionLevelsId, userDetailsWithPermissions.SeniorUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchyWithPermissions>(storeProcCommand, param)).ToList();
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
