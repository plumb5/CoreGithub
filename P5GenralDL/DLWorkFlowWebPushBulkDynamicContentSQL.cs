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
    public class DLWorkFlowWebPushBulkDynamicContentSQL : CommonDataBaseInteraction, IDLWorkFlowWebPushBulkDynamicContent
    {
        CommonInfo connection;

        public DLWorkFlowWebPushBulkDynamicContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushBulkDynamicContentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<WorkFlowWebPushBulk>> GetBulkpushSendingSettingList(Int16 SendStatus)
        {
            string storeProcCommand = "WorkFlow_WebPushBulkDynamicContent";
            object? param = new { Action= "GetBulkWebPushSendingIds",SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebPushBulk>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<WorkFlowWebPushBulk>> GetDetailsForMessageUpdate(int WebPushSendingSettingId)
        {
            string storeProcCommand = "WorkFlow_WebPushBulkDynamicContent";

            object? param = new { Action = "GetDetailsForMessageUpdate", WebPushSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebPushBulk>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async void UpdateMessageContent(DataTable AllData)
        {
            string storeProcCommand = "WorkFlow_WebPushBulkDynamicContent";
            object? param = new { Action = "UpdateMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async void DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "WorkFlow_WebPushBulkDynamicContent";
            object? param = new { Action = "DeleteMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
