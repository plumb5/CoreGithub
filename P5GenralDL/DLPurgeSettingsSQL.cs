using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLPurgeSettingsSQL : CommonDataBaseInteraction, IDLPurgeSettings
    {
        CommonInfo connection;
        public DLPurgeSettingsSQL()
        {
            connection = GetDBConnection();
        }

        public DLPurgeSettingsSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> Save(PurgeSettings PurgeSettings)
        {
            string storeProcCommand = "Purge_Setting";
            object? param = new { @Action = "Save", PurgeSettings.AccountId, PurgeSettings.TrackingDataCount, PurgeSettings.TrackingDataMonth, PurgeSettings.SmsSentDataCount, PurgeSettings.SmsSentDataMonth, PurgeSettings.MailSentDataCount, PurgeSettings.MailSentDataMonth, PurgeSettings.WebPushSentDataCount, PurgeSettings.WebPushSentDataMonth, PurgeSettings.WhatsAppSentDataCount, PurgeSettings.WhatsAppSentDataMonth };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<Int32> Update(PurgeSettings PurgeSettings)
        {
            string storeProcCommand = "Purge_Setting";
            object? param = new { @Action = "Update", PurgeSettings.Id, PurgeSettings.AccountId, PurgeSettings.TrackingDataCount, PurgeSettings.TrackingDataMonth, PurgeSettings.MailSentDataCount, PurgeSettings.MailSentDataMonth, PurgeSettings.SmsSentDataCount, PurgeSettings.SmsSentDataMonth, PurgeSettings.WebPushSentDataCount, PurgeSettings.WebPushSentDataMonth, PurgeSettings.WhatsAppSentDataCount, PurgeSettings.WhatsAppSentDataMonth };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<List<PurgeSettings>> GetPurgeSettings(int accountId)
        {
            string storeProcCommand = "Purge_Setting";
            object? param = new { @Action = "GET", accountId };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PurgeSettings>(storeProcCommand, param)).ToList();
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


