using Dapper;
using DBInteraction;
using IP5GenralDL;
using Microsoft.Data.SqlClient;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsBulkSentDynamicContentSQL : CommonDataBaseInteraction, IDLSmsBulkSentDynamicContent
    {
        CommonInfo connection;

        public DLSmsBulkSentDynamicContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentDynamicContentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsSendingSetting>> GetBulkSmsSendingSettingList(Int16 SendStatus)
        {
            string storeProcCommand = "Sms_BulkSentDynamicContent";
            object? param = new { Action="GetBulkSmsSendingIds", SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_BulkSentDynamicContent";
            object? param = new { Action = "GetDetailsForMessageUpdate", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async void UpdateMessageContent(DataTable AllData)
        {
            string storeProcCommand = "Sms_BulkSentDynamicContent";
            object? param = new { Action = "UpdateMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async void DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "Sms_BulkSentDynamicContent";
            object? param = new { Action = "DeleteMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await  db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
