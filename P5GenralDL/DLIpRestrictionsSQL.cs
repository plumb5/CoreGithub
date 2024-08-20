using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLIpRestrictionsSQL : CommonDataBaseInteraction, IDLIpRestrictions
    {
        CommonInfo connection;
        public DLIpRestrictionsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLIpRestrictionsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> SaveAndUpdate(IpRestrictions IpRestrictions)
        {
            string storeProcCommand = "Ip_Restrictions";
            object? param = new { @Action = "SaveAndUpdate", IpRestrictions.IsAllowSubdomain, IpRestrictions.IncludeIPAddress, IpRestrictions.IncludeSubDirectory, IpRestrictions.IncludeCity, IpRestrictions.IncludeCountry, IpRestrictions.ExcludeIPAddress, IpRestrictions.ExcludeSubDirectory, IpRestrictions.ExcludeCity, IpRestrictions.ExcludeCountry, IpRestrictions.IsDeviceTrackingRequired };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IpRestrictions?> GetIpRestrictions()
        {
            string storeProcCommand = "Ip_Restrictions";
            object? param = new { @Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<IpRestrictions?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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


