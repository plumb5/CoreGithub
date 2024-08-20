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
    public class DLWorkFlowMobileAppPushOneToOneSQL : CommonDataBaseInteraction, IDLWorkFlowMobileAppPushOneToOne
    {
        CommonInfo connection;
        public DLWorkFlowMobileAppPushOneToOneSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowMobileAppPushOneToOneSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId)
        {
            string storeProcCommand = "WorkFlow_MobileAppPushOneToOne";
            object? param = new { Action = "DeleteAllTheDataWhichAreInQuque", WorkflowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
