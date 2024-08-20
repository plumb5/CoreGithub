using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLIpRestrictionsPG : CommonDataBaseInteraction, IDLIpRestrictions
    {
        CommonInfo connection;
        public DLIpRestrictionsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLIpRestrictionsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> SaveAndUpdate(IpRestrictions IpRestrictions)
        {
            string storeProcCommand = "select ip_restrictions_saveandupdate(@IsAllowSubdomain, @IncludeIPAddress, @IncludeSubDirectory, @IncludeCity, @IncludeCountry, @ExcludeIPAddress, @ExcludeSubDirectory, @ExcludeCity, @ExcludeCountry, @IsDeviceTrackingRequired)";
            object? param = new { IpRestrictions.IsAllowSubdomain, IpRestrictions.IncludeIPAddress, IpRestrictions.IncludeSubDirectory, IpRestrictions.IncludeCity, IpRestrictions.IncludeCountry, IpRestrictions.ExcludeIPAddress, IpRestrictions.ExcludeSubDirectory, IpRestrictions.ExcludeCity, IpRestrictions.ExcludeCountry, IpRestrictions.IsDeviceTrackingRequired };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<IpRestrictions?> GetIpRestrictions()
        {
            string storeProcCommand = "select * from ip_restrictions_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<IpRestrictions?>(storeProcCommand);
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

