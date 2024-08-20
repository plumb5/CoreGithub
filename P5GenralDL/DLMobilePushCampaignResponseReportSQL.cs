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
    public class DLMobilePushCampaignResponseReportSQL : CommonDataBaseInteraction, IDLMobilePushCampaignResponseReport
    {
        CommonInfo connection;
        public DLMobilePushCampaignResponseReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushCampaignResponseReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> MaxCount(MLMobilePushCampaignResponseReport mobpushReport, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "MobilePush_CustomReport";
            object? param = new { Action = "GetCount", mobpushReport.MobilePushSendingSettingId, mobpushReport.Sent, mobpushReport.NotSent, mobpushReport.IsViewed, mobpushReport.IsClicked, mobpushReport.IsClosed, mobpushReport.IsUnsubscribed, mobpushReport.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLMobilePushCampaignResponseReport>> GetReportDetails(MLMobilePushCampaignResponseReport mobpushReport, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "MobilePush_CustomReport";
            object? param = new { Action = "GetReportData", mobpushReport.MobilePushSendingSettingId, mobpushReport.Sent, mobpushReport.NotSent, mobpushReport.IsViewed, mobpushReport.IsClicked, mobpushReport.IsClosed, mobpushReport.IsUnsubscribed, mobpushReport.WorkFlowId, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobilePushCampaignResponseReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
