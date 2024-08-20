using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLMobilePushSettingsSQL : CommonDataBaseInteraction, IDLMobilePushSettings
    {
        CommonInfo connection;
        public DLMobilePushSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSettingsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(MobilePushSettings mobilepushSettings)
        {
            const string storeProcCommand = "MobilePush_Settings";
            object? param = new { @Action = "Save", mobilepushSettings.AndroidPackageName, mobilepushSettings.FcmProjectNo, mobilepushSettings.FcmApiKey, mobilepushSettings.FcmConfigurationUrl, mobilepushSettings.IosPackageName, mobilepushSettings.IosPushType, mobilepushSettings.IosCertificate, mobilepushSettings.IosPassword, mobilepushSettings.IosPushMode, mobilepushSettings.IosFcmConfigFile, mobilepushSettings.IosFcmTeamId, mobilepushSettings.IosFcmBundleIdentifier, mobilepushSettings.Status, mobilepushSettings.IsFcmAndroidAndIOS, mobilepushSettings.Type, mobilepushSettings.HybridApp, mobilepushSettings.ProviderName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<MobilePushSettings?> GetMobilePushSettings()
        {
            const string storeProcCommand = "MobilePush_Settings";
            object? param = new { @Action = "GetMobilePushSettings" };

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

