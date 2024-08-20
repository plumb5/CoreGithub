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
    public class DLAdminAccountDetailsSQL : CommonDataBaseInteraction, IDLAdminAccountDetails
    {
        CommonInfo connection;
        public DLAdminAccountDetailsSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<List<Account>> GetAllAccountDetails(int? Offset = 0, int? fetchnext = 0, short? AccountType = null, string AccountName = null, DateTime? CreatedFromDateTime = null, DateTime? CreatedTodateTime = null, DateTime? ExpiryFromDateTime = null, DateTime? ExpiryTodateTime = null, short? Status = null)
        {
            string storeProcCommand = "Account_Details";
            object? param = new { Action = "GetAllAccountDetailsForAdmin", Offset, fetchnext, AccountType, AccountName, CreatedFromDateTime, CreatedTodateTime, ExpiryFromDateTime, ExpiryTodateTime, Status };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Account>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<Account>> GetAccountDetailsByAccountType(short FeatureGroupId)
        {
            string storeProcCommand = "Account_Details";
            object? param = new { Action = "GetDetailsByAccountType", FeatureGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Account>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
