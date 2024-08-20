using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLUserGroupMembersSQL : CommonDataBaseInteraction, IDLUserGroupMembers
    {
        CommonInfo connection;

        public DLUserGroupMembersSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<List<MLUserHierarchy>> GetHisUsers(int UserGroupId)
        {
            string storeProcCommand = "UserGroup_Members";
            object? param = new { Action = "GetHisUsers", UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserHierarchy>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<Members>> GetUserGroupMembers(List<int> ListofUserGroupMember)
        {
            string storeProcCommand = "UserGroup_Members";
            object? param = new { Action = "GetUserGroupMembers", ListofUserGroupMembers = string.Join(",", ListofUserGroupMember) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Members>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<int> AddToGroup(int UserInfoUserId, int UserGroupId)
        {
            const string storeProcCommand = "UserGroup_Members";
            object? param = new { Action = "AddToGroup", UserInfoUserId, UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RemoveFromGroup(int UserInfoUserId, int UserGroupId)
        {
            const string storeProcCommand = "UserGroup_Members";
            object? param = new { Action = "RemoveFromGroup", UserInfoUserId, UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
