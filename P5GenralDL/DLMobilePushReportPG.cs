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
    public class DLMobilePushReportPG : CommonDataBaseInteraction, IDLMobilePushReport
    {
        readonly CommonInfo connection;
        public DLMobilePushReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName)
        {
            string storeProcCommand = "select mobilepush_reportdetails_getmaxcount(@FromDateTime, @ToDateTime, @CampaignName)";
            object? param = new { FromDateTime, ToDateTime, CampaignName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMobilePushReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null)
        {
            string storeProcCommand = "select * from mobilepush_reportdetails_getreportdata(@FromDateTime, @ToDateTime, @CampaignName, @OffSet, @FetchNext)";
            object? param = new { FromDateTime, ToDateTime, CampaignName, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobilePushReport>(storeProcCommand, param)).ToList();
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
