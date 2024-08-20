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
    public class DLTotalVisitDetailsPG : CommonDataBaseInteraction, IDLTotalVisitDetails
    {
        CommonInfo connection = null;
        public DLTotalVisitDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLTotalVisitDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> GetTrackingVisitDetailsCount(DateTime FromDate, DateTime ToDate)
        {
            string storeProcCommand = "select visitortracking_countdetails_totalvisitdetails( @FromDate, @ToDate)";
            object? param = new { FromDate, ToDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
