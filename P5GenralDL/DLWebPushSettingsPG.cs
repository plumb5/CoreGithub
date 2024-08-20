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
    public class DLWebPushSettingsPG : CommonDataBaseInteraction, IDLWebPushSettings
    {
        CommonInfo connection;
        public DLWebPushSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushSettingsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(WebPushSettings webpushSettings)
        {
            const string storeProcCommand = "select webpush_settings_save(@ProviderName, @FCMProjectNo, @FCMApiKey, @Status, @VapidPublicKey, @VapidPrivateKey, @VapidSubject)";
            object? param = new { webpushSettings.ProviderName, webpushSettings.FCMProjectNo, webpushSettings.FCMApiKey, webpushSettings.Status, webpushSettings.VapidPublicKey, webpushSettings.VapidPrivateKey, webpushSettings.VapidSubject };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<WebPushSettings?> GetWebPushSettings()
        {
            const string storeProcCommand = "select * from webpush_settings_getwebpushsettings()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSettings>(storeProcCommand);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
