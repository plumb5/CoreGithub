using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLAdminUserInfoSQL : CommonDataBaseInteraction, IDLAdminUserInfo
    {
        CommonInfo connection;
        public DLAdminUserInfoSQL()
        {
            connection = GetDBConnection();
        }
        public async Task<MLAdminUserInfo?> GetDetails(string EmailId)
        {
            string storeProcCommand = "Admin_GetUserDetails";
            object? param = new { Action = "GET", EmailId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminUserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<long> UpdateLastSignedIn(int UserId)
        {
            string storeProcCommand = "Admin_GetUserDetails";
            object? param = new { Action = "Save", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<long> InsertEventLog(int UserId, int AccountId, string AccountName, string Description, string MailTo, string MailFrom, string Subject, string BodyMessage, string UserName)
        {
            string storeProcCommand = "Admin_GetUserDetails";
            object? param = new { Action = "InsertEventLog", UserId, AccountId, AccountName, Description, MailTo, MailFrom, Subject, BodyMessage, UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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

