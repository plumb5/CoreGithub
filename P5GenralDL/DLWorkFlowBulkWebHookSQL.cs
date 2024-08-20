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
    public class DLWorkFlowBulkWebHookSQL : CommonDataBaseInteraction, IDLWorkFlowBulkWebHook
    {
        CommonInfo connection;
        public DLWorkFlowBulkWebHookSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowBulkWebHookSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<IEnumerable<WorkFlowBulkWebHook>> GetWebHookBulkDetails(WorkFlowBulkWebHook webhook, int MaxLimit)
        {
            string storeProcCommand = "WorkFlow_WebHookBulkInsert";

            object? param = new {Action= "GetWebHookDetails", webhook.SendStatus, webhook.WebHookSendingSettingId, webhook.WorkFlowId, webhook.WorkFlowDataId, MaxLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowBulkWebHook>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

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
