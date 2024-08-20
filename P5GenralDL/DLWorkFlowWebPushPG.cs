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
    public class DLWorkFlowWebPushPG : CommonDataBaseInteraction, IDLWorkFlowWebPush
    {
        CommonInfo connection;
        public DLWorkFlowWebPushPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushPG(string connectionString)
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
            string storeProcCommand = "select workflow_webpush_save(@WebPushTemplateId,@IsTriggerEveryActivity)"; 
            object? param = new { workFlowWebPush.WebPushTemplateId, workFlowWebPush.IsTriggerEveryActivity };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="workFlowWebPush"></param>
        /// <returns></returns>
        public async Task<bool> Update(MLWorkFlowWebPush workFlowWebPush)
        {
            string storeProcCommand = "select workflow_webpush_update(@ConfigureWebPushId, @WebPushTemplateId, @IsTriggerEveryActivity)";
            object? param = new { workFlowWebPush.ConfigureWebPushId, workFlowWebPush.WebPushTemplateId, workFlowWebPush.IsTriggerEveryActivity };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ConfigureWebPushId"></param>
        /// <returns></returns>
        public async Task<sendingDatalist?>  GetDetails(int ConfigureWebPushId)
        {
            string storeProcCommand = "select * from workflow_webpush_getdetails(@ConfigureWebPushId)"; 
            object? param = new { ConfigureWebPushId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<sendingDatalist?>(storeProcCommand, param);

        }
        public async Task<MLWorkFlowWebPush?> GetCountsData(int ConfigureWebPushId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string MachineId = null)
        {
            string storeProcCommand = "select * from workflow_webpush_getcounts(@ConfigureWebPushId, @FromDate, @ToDate, @IsSplitTested, @MachineId)";
            object? param = new { ConfigureWebPushId, FromDate, ToDate, IsSplitTested, MachineId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLWorkFlowWebPush?>(storeProcCommand, param);
        }

        public async Task<WorkFlowWebPush?> GetWebPushDetails(int ConfigureWebPushId)
        {
            string storeProcCommand = "select * from workflow_webpush_getwebpushdetails(@ConfigureWebPushId)"; 
            object? param = new { ConfigureWebPushId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WorkFlowWebPush?>(storeProcCommand, param);
        }

        public async Task<IEnumerable<WorkFlowWebPush>>  GetRecentWebPushCampaignsForInterval()
        {
            string storeProcCommand = "select * from workflow_webpush_getrecentwebpushcampaignsforinterval()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebPush>(storeProcCommand);

        }
         
        public async void UpdateWebPushCampaignSendStatus(int workflowWebPushSendingSettingId)
        {
            string storeProcCommand = "select workflow_webpush_updatewebpushcampaignsendstatus(@workflowWebPushSendingSettingId)";
            
            object? param = new { workflowWebPushSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
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
