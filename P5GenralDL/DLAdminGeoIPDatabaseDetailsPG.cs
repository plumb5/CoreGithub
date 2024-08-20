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
    public class DLAdminGeoIPDatabaseDetailsPG : CommonDataBaseInteraction, IDLAdminGeoIPDatabaseDetails
    {
        CommonInfo connection;

        public DLAdminGeoIPDatabaseDetailsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveGeoIPDatabaseDetails(AdminGeoIPDatabaseDetails geoIPDatabaseDetails)
        {
            string storeProcCommand = "select geoipdatabase_details_save(@IPDBFileName,@IPFileUrl,@TotalRows)";
            object? param = new { geoIPDatabaseDetails.IPDBFileName, geoIPDatabaseDetails.IPFileUrl, geoIPDatabaseDetails.TotalRows };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<int> MaxCount()
        {
            string storeProcCommand = "select geoipdatabase_details_maxcount()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
        }
        public async Task<List<AdminGeoIPDatabaseDetails>> GetReport(int Offset, int FetchNext)
        {
            string storeProcCommand = "select * from geoipdatabase_details_get(@Offset, @FetchNext)";
            object? param = new { Offset, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<AdminGeoIPDatabaseDetails>(storeProcCommand, param)).ToList();
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
