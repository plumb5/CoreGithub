using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminUserInfoPG : CommonDataBaseInteraction, IDLAdminUserInfo
    {
        CommonInfo connection;
        public DLAdminUserInfoPG()
        {
            connection = GetDBConnection();
        }
        public async Task<MLAdminUserInfo?> GetDetails(string EmailId)
        {
            string storeProcCommand = "select * from admin_getuserdetails_get(@EmailId)";
            object? param = new { EmailId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminUserInfo?>(storeProcCommand, param);
        }

        public async Task<long> UpdateLastSignedIn(int UserId)
        {
            string storeProcCommand = "select admin_getuserdetails_lastsignedinupdate(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        public async Task<long> InsertEventLog(int UserId, int AccountId, string AccountName, string Description, string MailTo, string MailFrom, string Subject, string BodyMessage, string UserName)
        {
            string storeProcCommand = "select admin_getuserdetails_inserteventlog(@UserId, @AccountId, @AccountName, @Description, @MailTo, @MailFrom, @Subject, @BodyMessage, @UserName)";
            object? param = new { UserId, AccountId, AccountName, Description, MailTo, MailFrom, Subject, BodyMessage, UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
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

