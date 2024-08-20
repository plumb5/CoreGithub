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
    public class DLWorkFlowMobileAppPushOneToOnePG : CommonDataBaseInteraction, IDLWorkFlowMobileAppPushOneToOne
    {
        CommonInfo connection;
        public DLWorkFlowMobileAppPushOneToOnePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowMobileAppPushOneToOnePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId)
        {
            string storeProcCommand = "select workflow_mobileapppushonetoone_deleteallthedatawhichareinquque(@WorkflowId)";
            object? param = new { WorkflowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
