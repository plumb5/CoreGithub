using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebHookSentSQL : CommonDataBaseInteraction, IDLWebHookSent
    {
        CommonInfo connection;
        public DLWebHookSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebHookSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> SaveBulkWebHookResponses(DataTable WebHookSentBulk)
        {
            string storeProcCommand = "WebHook_Sent";
            object? param = new { Action = "SaveResponsesForWebHookResponses", WebHookSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }

        public async Task<bool> DeleteResponsesFromWebHookBulk(DataTable WebHookSentBulk)
        {
            string storeProcCommand = "WebHook_Sent";
            object? param = new { Action = "DeleteResponsesFromWebHookBulk", WebHookSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }

        public async Task<bool> UpdateTotalCounts(DataTable WebHookSentBulk, int ConfigureWebHookId)
        {
            string storeProcCommand = "WebHook_Sent";
            object? param = new { Action = "UpdateTotalCounts", WebHookSentBulk, ConfigureWebHookId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }


        public async Task<int> MaxCount(int WebHookSendingSettingId, int Sucess, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "WebHook_Sent";
            object? param = new { Action = "GetWebHookMaxSentDetailsCount", WebHookSendingSettingId, Sucess, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLWebHookSentDetails>> GetWebHookSentDetails(int WebHookSendingSettingId, int Sucess, int OffSet, int FetchNext, DateTime? FromDate = null, DateTime? ToDate = null)
        {
            string storeProcCommand = "WebHook_Sent";
            object? param = new { Action = "GetWebHookSentDetails", @WebHookSendingSettingId, @Sucess, @OffSet, @FetchNext, @FromDate, @ToDate };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWebHookSentDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
