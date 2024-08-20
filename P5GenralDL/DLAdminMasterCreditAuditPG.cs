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
    public class DLAdminMasterCreditAuditPG : CommonDataBaseInteraction, IDLAdminMasterCreditAudit
    {
        CommonInfo connection;
        public DLAdminMasterCreditAuditPG()
        {
            connection = GetDBConnection();
        }

        public async Task<int> GetMaxcount(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null)
        {
            string storeProcCommand = "select * from mastercredit_audit_maxcount(@ConsumableType, @ProviderName, @FromDateTime, @ToDateTime)";
            object? param = new { masterCreditAudit.ConsumableType, masterCreditAudit.ProviderName, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<AdminMasterCreditAudit>> GetDetails(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null, int FetchNext = 0, int offset = 0)
        {
            string storeProcCommand = "select * from mastercredit_audit_getdetails(@ConsumableType, @ProviderName, @FromDateTime, @ToDateTime, @FetchNext, @offset)";
            object? param = new { masterCreditAudit.ConsumableType, masterCreditAudit.ProviderName, FromDateTime, ToDateTime, FetchNext, offset };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<AdminMasterCreditAudit>(storeProcCommand, param);
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
