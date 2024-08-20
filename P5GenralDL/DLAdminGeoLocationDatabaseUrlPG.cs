using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;

namespace P5GenralDL
{
    public class DLAdminGeoLocationDatabaseUrlPG : CommonDataBaseInteraction, IDLAdminGeoLocationDatabaseUrl
    {
        CommonInfo connection;
        public DLAdminGeoLocationDatabaseUrlPG()
        {
            connection = GetDBConnection();
        }
        public async Task<Int32> SaveGeoLocationDatabaseUrl(AdminGeoLocationDatabaseUrl geoLocationDatabase)
        {
            string storeProcCommand = "select geolocation_databaseurl_save(@IpDatabaseAPIURL)";
            object? param = new { geoLocationDatabase.IpDatabaseAPIURL };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<AdminGeoLocationDatabaseUrl?> GetGeoLocationDatabaseUrl()
        {
            string storeProcCommand = "select * from geolocation_databaseurl_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<AdminGeoLocationDatabaseUrl?>(storeProcCommand);
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
