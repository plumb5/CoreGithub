using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLMobilePushSettingsPG : CommonDataBaseInteraction, IDLMobilePushSettings
    {
        CommonInfo connection;
        public DLMobilePushSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSettingsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(MobilePushSettings mobilepushSettings)
        {
            string storeProcCommand = "select mobilepush_settings_save(@AndroidPackageName, @FcmProjectNo, @FcmApiKey, @FcmConfigurationUrl, @IosPackageName, @IosPushType, @IosCertificate, @IosPassword, @IosPushMode, @IosFcmConfigFile, @IosFcmTeamId, @IosFcmBundleIdentifier, @Status, @IsFcmAndroidAndIOS, @Type, @HybridApp, @ProviderName)";
            object? param = new { mobilepushSettings.AndroidPackageName, mobilepushSettings.FcmProjectNo, mobilepushSettings.FcmApiKey, mobilepushSettings.FcmConfigurationUrl, mobilepushSettings.IosPackageName, mobilepushSettings.IosPushType, mobilepushSettings.IosCertificate, mobilepushSettings.IosPassword, mobilepushSettings.IosPushMode, mobilepushSettings.IosFcmConfigFile, mobilepushSettings.IosFcmTeamId, mobilepushSettings.IosFcmBundleIdentifier, mobilepushSettings.Status, mobilepushSettings.IsFcmAndroidAndIOS, mobilepushSettings.Type, mobilepushSettings.HybridApp, mobilepushSettings.ProviderName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<MobilePushSettings?> GetMobilePushSettings()
        {
            string storeProcCommand = "select * from mobilepush_settings_getmobilepushsettings()";

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<MobilePushSettings?>(storeProcCommand);
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
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}

