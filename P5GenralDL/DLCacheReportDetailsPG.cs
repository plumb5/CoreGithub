using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLCacheReportDetailsPG : CommonDataBaseInteraction, IDLCacheReportDetails
    {
        CommonInfo connection;
        public DLCacheReportDetailsPG(int adsId)
        {
            connection = GetDBConnection();
        }
        public DLCacheReportDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<object> GetCacheReportDetails(MLCacheReportDetails cachereport)
        {
            try
            {
                string storeProcCommand = "select * from CachedVisits(@Action, @Duration, @Start, @End, @FromDate, @ToDate)";
                object? param = new { cachereport.Action, cachereport.Duration, cachereport.Start, cachereport.End, cachereport.FromDate, cachereport.ToDate };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<DataSet>(storeProcCommand, param);

            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<object> GetCachedMobileReportDetails(MLCacheReportDetails cachereport)
        {
            try
            {
                string storeProcCommand = "select * from CachedMobile_Data(@Action, @FromDate, @ToDate, @Duration, @Start, @End)";
                object? param = new { cachereport.Action, cachereport.FromDate, cachereport.ToDate, cachereport.Duration, cachereport.Start, cachereport.End };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<DataSet>(storeProcCommand, param);

            }
            catch (Exception)
            {
                throw;
            }
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
