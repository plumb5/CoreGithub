using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLAdminMasterCreditAuditSQL : CommonDataBaseInteraction, IDLAdminMasterCreditAudit
    {
        CommonInfo connection;
        public DLAdminMasterCreditAuditSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<int> GetMaxcount(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null)
        {
            string storeProcCommand = "MasterCredit_Audit";
            object? param = new { Action = "Maxcount", masterCreditAudit.ConsumableType, masterCreditAudit.ProviderName, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<AdminMasterCreditAudit>> GetDetails(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null, int FetchNext = 0, int offset = 0)
        {
            string storeProcCommand = "MasterCredit_Audit";
            object? param = new { Action = "GetDetails", masterCreditAudit.ConsumableType, masterCreditAudit.ProviderName, FromDateTime, ToDateTime, FetchNext, offset };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<AdminMasterCreditAudit>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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

