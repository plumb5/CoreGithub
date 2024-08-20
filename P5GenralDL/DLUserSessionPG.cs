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
    public class DLUserSessionPG : CommonDataBaseInteraction, IDLUserSession
    {
        CommonInfo connection;

        public DLUserSessionPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> Save(UserSession UserSession)
        {
            string storeProcCommand = "select user_session_save(@UserInfoUserId, @UserGroupId, @SessionId, @AuthValue, @SecureKey, @IsLocked)";
            object? param = new { UserSession.UserInfoUserId, UserSession.UserGroupId, UserSession.SessionId, UserSession.AuthValue, UserSession.SecureKey, UserSession.IsLocked };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<UserSession?> Get(UserSession UserSession)
        {
            string storeProcCommand = "select * from user_session_get(@UserInfoUserId)";
            object? param = new { UserSession.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserSession?>(storeProcCommand, param);
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
