using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLFormChatWebHookResponseSQL : CommonDataBaseInteraction, IDLFormChatWebHookResponse
    {
        CommonInfo connection = null;
        public DLFormChatWebHookResponseSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormChatWebHookResponseSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(int formOrChatId, string callingSource, string webhookids = null)
        {
            string storeProcCommand = "FormChat_WebHookResponses";
            object? param = new { @Action = "MaxCount", formOrChatId, callingSource, webhookids };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<WebHookTracker>> GetDetails(int formOrChatId, string callingSource, int OffSet, int FetchNext, string webhookids = null)
        {
            string storeProcCommand = "FormChat_WebHookResponses";
            object? param = new { @Action = "Get", formOrChatId, callingSource, webhookids, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebHookTracker>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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

