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
    public class DLAdminAccountDetailsPG : CommonDataBaseInteraction, IDLAdminAccountDetails
    {
        CommonInfo connection;
        public DLAdminAccountDetailsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<List<Account>> GetAllAccountDetails(int? Offset = 0, int? fetchnext = 0, short? AccountType = null, string AccountName = null, DateTime? CreatedFromDateTime = null, DateTime? CreatedTodateTime = null, DateTime? ExpiryFromDateTime = null, DateTime? ExpiryTodateTime = null, short? Status = null)
        {
            string storeProcCommand = "select * from account_details_getallaccountdetailsforadmin(@Offset, @fetchnext, @AccountType, @AccountName, @CreatedFromDateTime, @CreatedTodateTime, @ExpiryFromDateTime, @ExpiryTodateTime, @Status)";
            object? param = new { Offset, fetchnext, AccountType, AccountName, CreatedFromDateTime, CreatedTodateTime, ExpiryFromDateTime, ExpiryTodateTime, Status };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Account>(storeProcCommand, param)).ToList();
        }

        public async Task<List<Account>> GetAccountDetailsByAccountType(short FeatureGroupId)
        {
            string storeProcCommand = "select * from account_details_getdetailsbyaccounttype(@FeatureGroupId)";
            object? param = new { FeatureGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Account>(storeProcCommand, param)).ToList();
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
