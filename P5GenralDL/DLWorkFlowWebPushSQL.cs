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
    public class DLWorkFlowWebPushSQL : CommonDataBaseInteraction, IDLWorkFlowWebPush
    {
        CommonInfo connection;
        public DLWorkFlowWebPushSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="workFlowWebPush"></param>
        /// <returns></returns>
        public async Task<Int32> Save(MLWorkFlowWebPush workFlowWebPush)
        {
            string storeProcCommand = "WorkFlow_WebPush)";
            object? param = new { Action= "Save", workFlowWebPush.WebPushTemplateId, workFlowWebPush.IsTriggerEveryActivity };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="workFlowWebPush"></param>
        /// <returns></returns>
        public async Task<bool> Update(MLWorkFlowWebPush workFlowWebPush)
        {
            string storeProcCommand = "WorkFlow_WebPush";
            object? param = new { Action = "Update", workFlowWebPush.ConfigureWebPushId, workFlowWebPush.WebPushTemplateId, workFlowWebPush.IsTriggerEveryActivity };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0; 
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ConfigureWebPushId"></param>
        /// <returns></returns>
        public async Task<sendingDatalist?> GetDetails(int ConfigureWebPushId)
        {
            string storeProcCommand = "WorkFlow_WebPush";
            object? param = new { Action = "GetDetails", ConfigureWebPushId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<sendingDatalist?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }
        public async Task<MLWorkFlowWebPush?> GetCountsData(int ConfigureWebPushId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string MachineId = null)
        {
            string storeProcCommand = "WorkFlow_WebPush";
            object? param = new { Action = "GetCounts", ConfigureWebPushId, FromDate, ToDate, IsSplitTested, MachineId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLWorkFlowWebPush?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<WorkFlowWebPush?> GetWebPushDetails(int ConfigureWebPushId)
        {
            string storeProcCommand = "WorkFlow_WebPush";
            object? param = new { Action = "GetWebPushDetails", ConfigureWebPushId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WorkFlowWebPush?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<WorkFlowWebPush>> GetRecentWebPushCampaignsForInterval()
        {
            string storeProcCommand = "select * from workflow_webpush_getrecentwebpushcampaignsforinterval()";
            object? param = new { Action = "GetRecentWebPushCampaignsForInterval"    };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebPush>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

        }

        public async void UpdateWebPushCampaignSendStatus(int workflowWebPushSendingSettingId)
        {
            string storeProcCommand = "WorkFlow_WebPush";

            object? param = new { Action = "UpdateWebPushCampaignSendStatus", workflowWebPushSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
