using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMobilePushReportSQL : CommonDataBaseInteraction, IDLMobilePushReport
    {
        readonly CommonInfo connection;
        public DLMobilePushReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName)
        {
            string storeProcCommand = "MobilePush_ReportDetails";
            object? param = new { Action = "GetMaxCount", FromDateTime, ToDateTime, CampaignName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMobilePushReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null)
        {
            string storeProcCommand = "MobilePush_ReportDetails";
            object? param = new { Action = "GetReportData", FromDateTime, ToDateTime, CampaignName, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobilePushReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
