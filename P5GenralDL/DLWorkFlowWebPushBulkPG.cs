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
    public class DLWorkFlowWebPushBulkPG : CommonDataBaseInteraction, IDLWorkFlowWebPushBulk
    {
        CommonInfo connection;
        public DLWorkFlowWebPushBulkPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushBulkPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
         
        public async Task<IEnumerable<WebPushSent>> GetBulkDetails(WorkFlowWebPushBulk webPushSent, int MaxCount)
        {
            string storeProcCommand = "select * from workflow_webpushbulk_getbulkdetails(@SendStatus, @ConfigureWebPushId, @WorkFlowId, @WorkFlowDataId, @MaxCount)"; 
            object? param = new { webPushSent.SendStatus, webPushSent.ConfigureWebPushId, webPushSent.WorkFlowId, webPushSent.WorkFlowDataId, MaxCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WebPushSent>(storeProcCommand, param);
        }

        public async Task<bool> UpdateSendingMachineIdStatus(List<Int64> WorkFlowBrowserPushBulkIds)
        {
            string WorkFlowBrowserPushBulkId = string.Join(",", WorkFlowBrowserPushBulkIds);
            string storeProcCommand = "select workflow_webpushbulk_updatesendingmachineidstatus(@WorkFlowBrowserPushBulkId)"; 
            object? param = new { WorkFlowBrowserPushBulkId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }



        public async Task<bool> DeleteFromWorkFlowBulkWebPushSent(List<Int64> WebPushSentBulkids)
        {
            string WebPushSentBulkid=string.Join(",", WebPushSentBulkids);
            string storeProcCommand = "select workflow_webpushbulk_deletefromworkflowbulk(@WebPushSentBulkid)"; 
            object? param = new { WebPushSentBulkid };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId)
        {
            string storeProcCommand = "select workflow_webpushbulk_deleteallthedatawhichareinquque(@WorkflowId)"; 
            object? param = new { WorkflowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<long> GetTotalBulkPush(int ConfigureWebPushId, int WorkFlowDataId, int WorkFlowId)
        {
            string storeProcCommand = "select workflow_webpushbulk_gettotalbulkpush(@ConfigureWebPushId, @WorkFlowDataId, @WorkFlowId )"; 
            object? param = new { ConfigureWebPushId, WorkFlowDataId, WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param) ;
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
