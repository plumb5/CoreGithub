using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLAdminMasterCreditSQL : CommonDataBaseInteraction, IDLAdminMasterCredit
    {
        CommonInfo connection;
        public DLAdminMasterCreditSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveDetails(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "Master_Credit";
            object? param = new { Action = "Save", masterCredit.ConsumableType, masterCredit.ProviderName, masterCredit.CreditAllocated, masterCredit.CreditConsumed, masterCredit.LastModifiedByUserName, masterCredit.Remarks };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateCreditConsumed(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "Master_Credit";
            object? param = new { Action = "UpdateCreditConsumed", masterCredit.CreditConsumed, masterCredit.LastModifiedByUserName, masterCredit.ConsumableType, masterCredit.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<AdminMasterCredit>> SelectMasterCredit(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "Master_Credit";
            object? param = new { Action = "SelectMasterCredit", masterCredit.ConsumableType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<AdminMasterCredit>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLAdminMasterCredit>> GetFeatureWiseMaxCount()
        {
            string storeProcCommand = "Master_Credit";
            object? param = new { Action = "GetFeatureWiseMaxCount" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLAdminMasterCredit>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
