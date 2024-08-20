using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailBulkSentSQL : CommonDataBaseInteraction, IDLMailBulkSent
    {
        CommonInfo connection = null;
        public DLMailBulkSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBulkSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> InsertToMailSent(DataTable mailsentbulk)
        {
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "Save", mailsentbulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateBulkMailSentDetails(List<long> MailBulkSentIds)
        {
            string value = string.Join(",", MailBulkSentIds);
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "UpdateMailSentContacts", value };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteSentMailBulk(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "DeleteSentMailBulk", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteTotalBulkMail(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "GetTotalBulkMail", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<long> GetTotalBulkMail(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "DeleteTotalBulkMail", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailSent>> GetBulkMailSentDetails(int MailSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "Mail_BulkSent";
            object? param = new { @Action = "GetMailSentContacts", MailSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


