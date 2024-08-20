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
    public class DLUserHierarchyPG : CommonDataBaseInteraction, IDLUserHierarchy
    {
        CommonInfo connection;

        public DLUserHierarchyPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> Save(UserHierarchy userHierarchy)
        {
            string storeProcCommand = "select user_hierarchy_save(@MainUserId, @AccountId, @UserInfoUserId, @SeniorUserId, @CreatedByUserId, @PermissionLevelsId)";
            object? param = new { userHierarchy.MainUserId, userHierarchy.AccountId, userHierarchy.UserInfoUserId, userHierarchy.SeniorUserId, userHierarchy.CreatedByUserId, userHierarchy.PermissionLevelsId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<MLUserHierarchy>> GetHisUsers(int UserId, int AccountId, int Getallusers = 0)
        {
            string storeProcCommand = "select * from user_hierarchy_gethisusers(@UserId, @AccountId, @Getallusers)";
            object? param = new { UserId, AccountId, Getallusers };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLUserHierarchy>> GetHisUsers(int UserId)
        {
            string storeProcCommand = "select * from user_hierarchy_gethisuserswithoutaccount(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param)).ToList();
        }

        public async Task<MLUserHierarchy?> GetUsersSenior(int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_hierarchy_getusersbyuserinfoid(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLUserHierarchy?>(storeProcCommand, param);
        }

        public async Task<MLUserHierarchy?> GetHisDetails(int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_hierarchy_gethisdetails(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLUserHierarchy?>(storeProcCommand, param);
        }

        public async Task<UserHierarchy?> GetHisRole(int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_hierarchy_gethisrole(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserHierarchy?>(storeProcCommand, param);
        }

        public async Task<bool> DeleteUserHierarchyByAccountId(int AccountId)
        {
            string storeProcCommand = "select user_hierarchy_delete(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLUserHierarchy>> GetUsersBySeniorIdForTree(int UserInfoUserId)
        {
            string storeProcCommand = "select * from user_hierarchy_getusersbysenioridfortree(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param)).ToList();
        }
        public async Task<List<UserHierarchy>> GetPermissionUsers(int UserId)
        {
            string storeProcCommand = "select * from user_hierarchy_gethisuserswithpermission(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserHierarchy>(storeProcCommand, param)).ToList();
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
