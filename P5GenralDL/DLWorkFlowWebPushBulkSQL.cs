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
    public class DLWorkFlowWebPushBulkSQL : CommonDataBaseInteraction, IDLWorkFlowWebPushBulk
    {
        CommonInfo connection;
        public DLWorkFlowWebPushBulkSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushBulkSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<WebPushSent>> GetBulkDetails(WorkFlowWebPushBulk webPushSent, int MaxCount)
        {
            string storeProcCommand = "WorkFlow_WebPushBulk";
            object? param = new {Action= "GetBulkDetails", webPushSent.SendStatus, webPushSent.ConfigureWebPushId, webPushSent.WorkFlowId, webPushSent.WorkFlowDataId, MaxCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WebPushSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> UpdateSendingMachineIdStatus(List<Int64> WorkFlowBrowserPushBulkIds)
        {
            string WorkFlowBrowserPushBulkId = string.Join(",", WorkFlowBrowserPushBulkIds);
            string storeProcCommand = "WorkFlow_WebPushBulk";
            object? param = new { Action = "UpdateSendingMachineIdStatus", WorkFlowBrowserPushBulkId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }



        public async Task<bool> DeleteFromWorkFlowBulkWebPushSent(List<Int64> WebPushSentBulkids)
        {
            string WebPushSentBulkid = string.Join(",", WebPushSentBulkids);
            string storeProcCommand = "WorkFlow_WebPushBulk";
            object? param = new { Action = "DeleteFromWorkFlowBulk", WebPushSentBulkid };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId)
        {
            string storeProcCommand = "WorkFlow_WebPushBulk";
            object? param = new { Action = "DeleteAllTheDataWhichAreInQuque", WorkflowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<long> GetTotalBulkPush(int ConfigureWebPushId, int WorkFlowDataId, int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_WebPushBulk";
            object? param = new { Action = "GetTotalBulkPush", ConfigureWebPushId, WorkFlowDataId, WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
