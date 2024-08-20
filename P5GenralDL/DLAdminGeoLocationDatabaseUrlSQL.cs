using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;


namespace P5GenralDL
{
    public class DLAdminGeoLocationDatabaseUrlSQL : CommonDataBaseInteraction, IDLAdminGeoLocationDatabaseUrl
    {
        CommonInfo connection;
        public DLAdminGeoLocationDatabaseUrlSQL()
        {
            connection = GetDBConnection();
        }
        public async Task<Int32> SaveGeoLocationDatabaseUrl(AdminGeoLocationDatabaseUrl geoLocationDatabase)
        {
            string storeProcCommand = "GeoLocation_DatabaseUrl";
            object? param = new { Action = "Save", geoLocationDatabase.IpDatabaseAPIURL };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<AdminGeoLocationDatabaseUrl?> GetGeoLocationDatabaseUrl()
        {
            string storeProcCommand = "GeoLocation_DatabaseUrl";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<AdminGeoLocationDatabaseUrl?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


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
