using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLMailBulkSentInitiationSQL : CommonDataBaseInteraction, IDLMailBulkSentInitiation
    {
        CommonInfo connection;
        public DLMailBulkSentInitiationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBulkSentInitiationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MailBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "Mail_BulkSentInitiation";
            object? param = new { @Action = "GetSentInitiation" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailBulkSentInitiation>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> UpdateSentInitiation(MailBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "Mail_BulkSentInitiation";
            object? param = new { @Action = "UpdateSentInitiation", BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "Mail_BulkSentInitiation";
            object? param = new { @Action = "ResetSentInitiation" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

