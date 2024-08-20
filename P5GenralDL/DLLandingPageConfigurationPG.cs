using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLLandingPageConfigurationPG : CommonDataBaseInteraction, IDLLandingPageConfiguration
    {
        CommonInfo connection;
        public DLLandingPageConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLandingPageConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(LandingPageConfiguration landingPageConfiguration)
        {
            string storeProcCommand = "select landingpage_configuration_save(@IsLandingPageConfigEnabled, @LandingPageName, @BucketUrl, @CloudFrontUrl)";
            object? param = new { landingPageConfiguration.IsLandingPageConfigEnabled, landingPageConfiguration.LandingPageName, landingPageConfiguration.BucketUrl, landingPageConfiguration.CloudFrontUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<LandingPageConfiguration> GetLandingPageConfiguration()
        {
            string storeProcCommand = "select * from landingpage_configuration_get()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LandingPageConfiguration>(storeProcCommand);
        }
        public async Task<LandingPageConfiguration?> GetConfigByLandingPage(string LandingPageName)
        {
            string storeProcCommand = "select * from landingpage_configuration_getbylandingpage(@LandingPageName)";
            object? param = new { LandingPageName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LandingPageConfiguration?>(storeProcCommand, param);
        }
        public async Task<bool> UpdateStatus(bool IsLandingPageConfigEnabled, string LandingPageName)
        {
            string storeProcCommand = "select landingpage_configuration_update(@LandingPageName, @IsLandingPageConfigEnabled)";
            object? param = new { LandingPageName, IsLandingPageConfigEnabled };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<bool>(storeProcCommand, param);
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


