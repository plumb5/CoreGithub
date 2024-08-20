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
    public class DLWebHookSentPG : CommonDataBaseInteraction, IDLWebHookSent
    {
        CommonInfo connection;
        public DLWebHookSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebHookSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> SaveBulkWebHookResponses(DataTable WebHookSentBulk)
        {
            string storeProcCommand = "select * from webhook_sent_saveresponsesforwebhookresponses(@WebHookSentBulk)";
            object? param = new { WebHookSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> DeleteResponsesFromWebHookBulk(DataTable WebHookSentBulk)
        {
            string storeProcCommand = "select * from webhook_sent_deleteresponsesfromwebhookbulk(@WebHookSentBulk)";
            object? param = new { WebHookSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> UpdateTotalCounts(DataTable WebHookSentBulk, int ConfigureWebHookId)
        {
            string storeProcCommand = "select * from webhook_sent_updatetotalcounts(@WebHookSentBulk, @ConfigureWebHookId)";
            object? param = new { WebHookSentBulk, ConfigureWebHookId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }


        public async Task<int> MaxCount(int WebHookSendingSettingId, int Sucess, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from webhook_sent_getwebhookmaxsentdetailscount(@WebHookSendingSettingId, @Sucess, @FromDateTime, @ToDateTime)";
            object? param = new { WebHookSendingSettingId, Sucess, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<MLWebHookSentDetails>> GetWebHookSentDetails(int WebHookSendingSettingId, int Sucess, int OffSet, int FetchNext, DateTime? FromDate = null, DateTime? ToDate = null)
        {
            string storeProcCommand = "select * from webhook_sent_getwebhooksentdetails(@WebHookSendingSettingId,@Sucess, @OffSet, @FetchNext, @FromDate, @ToDate)";
            object? param = new { WebHookSendingSettingId, Sucess, OffSet, FetchNext, FromDate, ToDate };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWebHookSentDetails>(storeProcCommand, param)).ToList();

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
