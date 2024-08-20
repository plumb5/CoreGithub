using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLPurgeSettingsPG : CommonDataBaseInteraction, IDLPurgeSettings
    {
        CommonInfo connection;
        public DLPurgeSettingsPG()
        {
            connection = GetDBConnection();
        }

        public DLPurgeSettingsPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> Save(PurgeSettings PurgeSettings)
        {
            string storeProcCommand = "select * from purgesetting_save(@AccountId, @TrackingDataCount, @TrackingDataMonth, @SmsSentDataCount, @SmsSentDataMonth, @MailSentDataCount, @MailSentDataMonth, @WebPushSentDataCount, @WebPushSentDataMonth, @WhatsAppSentDataCount, @WhatsAppSentDataMonth)";
            object? param = new { PurgeSettings.AccountId, PurgeSettings.TrackingDataCount, PurgeSettings.TrackingDataMonth, PurgeSettings.SmsSentDataCount, PurgeSettings.SmsSentDataMonth, PurgeSettings.MailSentDataCount, PurgeSettings.MailSentDataMonth, PurgeSettings.WebPushSentDataCount, PurgeSettings.WebPushSentDataMonth, PurgeSettings.WhatsAppSentDataCount, PurgeSettings.WhatsAppSentDataMonth };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<Int32> Update(PurgeSettings PurgeSettings)
        {
            string storeProcCommand = "select * from purgesetting_update(@Id, @AccountId, @TrackingDataCount, @TrackingDataMonth, @MailSentDataCount, @MailSentDataMonth, @SmsSentDataCount, @SmsSentDataMonth, @WebPushSentDataCount, @WebPushSentDataMonth, @WhatsAppSentDataCount, @WhatsAppSentDataMonth)";
            object? param = new { PurgeSettings.Id, PurgeSettings.AccountId, PurgeSettings.TrackingDataCount, PurgeSettings.TrackingDataMonth, PurgeSettings.MailSentDataCount, PurgeSettings.MailSentDataMonth, PurgeSettings.SmsSentDataCount, PurgeSettings.SmsSentDataMonth, PurgeSettings.WebPushSentDataCount, PurgeSettings.WebPushSentDataMonth, PurgeSettings.WhatsAppSentDataCount, PurgeSettings.WhatsAppSentDataMonth };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<List<PurgeSettings>> GetPurgeSettings(int accountId)
        {
            string storeProcCommand = "select * from purgesettings_getdetails(@accountId)";
            object? param = new { accountId };

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

