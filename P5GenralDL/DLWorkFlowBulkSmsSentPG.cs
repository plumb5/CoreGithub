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
    public class DLWorkFlowBulkSmsSentPG : CommonDataBaseInteraction, IDLWorkFlowBulkSmsSent
    {
        CommonInfo connection;
        public DLWorkFlowBulkSmsSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowBulkSmsSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WorkFlowBulkSmsSent>> GetSendingSettingIds(WorkFlowBulkSmsSent smsSent)
        {
            string storeProcCommand = "select * from workflow_smssent_getsendingsettingids(@SendStatus)";
            object? param = new { smsSent.SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowBulkSmsSent>(storeProcCommand, param)).ToList();
        }

        public async Task<List<WorkFlowBulkSmsSent>> GetDetailsForMessageUpdate(WorkFlowBulkSmsSent smsSent)
        {
            string storeProcCommand = "select * from workflow_smssent_getdetailsformessageupdate(@SmsSendingSettingId, @WorkFlowId, @WorkFlowDataId)";
            object? param = new { smsSent.SmsSendingSettingId, smsSent.WorkFlowId, smsSent.WorkFlowDataId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowBulkSmsSent>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> UpdateMessageContent(DataTable AllMessageContent)
        {
            string storeProcCommand = "select * from workflow_smssent_updatemessagecontent(@AllMessageContent)";
            object? param = new { AllMessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteUpdateMessageContent(DataTable AllMessageContent)
        {
            string storeProcCommand = "select * from workflow_smssent_deleteupdatemessagecontent(@AllMessageContent)";
            object? param = new { AllMessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_smsbulkinsert_deleteallthedatawhichareinquque(@WorkFlowId)";
            object? param = new { WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<long> GetTotalBulkSms(int SmsSendingSettingId, int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_smsbulkinsert_gettotalbulksms(@SmsSendingSettingId,@WorkFlowId)";
            object? param = new { SmsSendingSettingId, WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
