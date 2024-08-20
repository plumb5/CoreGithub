using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLipligenceSQL : CommonDataBaseInteraction, IDLipligence
    {
        CommonInfo connection;
        public DLipligenceSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLipligenceSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<ipligence?> GetLocationDetails(double IpDecimal)
        {
            long ip_long = (long)IpDecimal;
            string storeProcCommand = "GetIpligence";
            object? param = new { ip_long };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ipligence?>(storeProcCommand, param);
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

