using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLWorkFlowBulkSmsSentSQL : CommonDataBaseInteraction, IDLWorkFlowBulkSmsSent
    {
        CommonInfo connection;
        public DLWorkFlowBulkSmsSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowBulkSmsSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WorkFlowBulkSmsSent>> GetSendingSettingIds(WorkFlowBulkSmsSent smsSent)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "GetSendingSettingIds", smsSent.SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowBulkSmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<WorkFlowBulkSmsSent>> GetDetailsForMessageUpdate(WorkFlowBulkSmsSent smsSent)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "GetDetailsForMessageUpdate", smsSent.SmsSendingSettingId, smsSent.WorkFlowId, smsSent.WorkFlowDataId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowBulkSmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> UpdateMessageContent(DataTable AllMessageContent)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "UpdateMessageContent", AllMessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteUpdateMessageContent(DataTable AllMessageContent)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "DeleteUpdateMessageContent", AllMessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "DeleteAllTheDataWhichAreInQuque", WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<long> GetTotalBulkSms(int SmsSendingSettingId, int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_SmsSent";
            object? param = new { @Action = "GetTotalBulkSms", SmsSendingSettingId, WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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

