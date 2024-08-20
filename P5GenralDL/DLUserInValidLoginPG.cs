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
    public class DLUserInValidLoginPG : CommonDataBaseInteraction, IDLUserInValidLogin
    {
        CommonInfo connection;
        public DLUserInValidLoginPG()
        {
            connection = GetDBConnection();
        }

        public async Task<UserInValidLogin?> Save(UserInValidLogin userInValidLogin)
        {
            string storeProcCommand = "select * from user_invalidlogin_save(@UserInfoUserId, @InValidLoginDate, @InValidLoginCount, @IsLocked)";
            object? param = new { userInValidLogin.UserInfoUserId, userInValidLogin.InValidLoginDate, userInValidLogin.InValidLoginCount, userInValidLogin.IsLocked };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInValidLogin?>(storeProcCommand, param);
        }

        public async Task<UserInValidLogin?> GetDetail(UserInValidLogin userInValidLogin)
        {
            string storeProcCommand = "select * from user_invalidlogin_get(@UserInfoUserId)";
            object? param = new { userInValidLogin.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInValidLogin?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int UserInfoUserId)
        {
            string storeProcCommand = "select user_invalidlogin_delete(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
