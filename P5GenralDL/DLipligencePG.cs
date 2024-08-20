using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLipligencePG : CommonDataBaseInteraction, IDLipligence
    {
        CommonInfo connection;
        public DLipligencePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLipligencePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<ipligence?> GetLocationDetails(double IpDecimal)
        {
            long ip_long = (long)IpDecimal;
            string storeProcCommand = "select * from group_byfilter_get(@Ipdecimal)";
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
