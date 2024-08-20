using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLAdminGeoLocationDatabaseTableSQL : CommonDataBaseInteraction, IDLAdminGeoLocationDatabaseTable
    {
        CommonInfo connection;
        public DLAdminGeoLocationDatabaseTableSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<bool> CreateTempTableCreation(string dynamicTableName)
        {
            string storeProcCommand = "GeoLocation_DatabaseTable";
            object? param = new { @Action = "TempTableCreation", dynamicTableName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> RenameTableName(string dynamicTableName)
        {
            string storeProcCommand = "GeoLocation_DatabaseTable";
            object? param = new { @Action = "RenameTableName", dynamicTableName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
    }
}



