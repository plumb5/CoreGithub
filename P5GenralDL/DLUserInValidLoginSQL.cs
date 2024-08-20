using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLUserInValidLoginSQL : CommonDataBaseInteraction, IDLUserInValidLogin
    {
        CommonInfo connection;
        public DLUserInValidLoginSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<UserInValidLogin?> Save(UserInValidLogin userInValidLogin)
        {
            string storeProcCommand = "User_InValidLogin";
            object? param = new { Action = "Save", userInValidLogin.UserInfoUserId, userInValidLogin.InValidLoginDate, userInValidLogin.InValidLoginCount, userInValidLogin.IsLocked };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInValidLogin?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<UserInValidLogin?> GetDetail(UserInValidLogin userInValidLogin)
        {
            string storeProcCommand = "User_InValidLogin";
            object? param = new { Action = "Get", userInValidLogin.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInValidLogin?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int UserInfoUserId)
        {
            string storeProcCommand = "User_InValidLogin";
            object? param = new { Action = "Delete", UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
