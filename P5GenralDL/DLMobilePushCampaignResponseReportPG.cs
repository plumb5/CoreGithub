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
    public class DLMobilePushCampaignResponseReportPG : CommonDataBaseInteraction, IDLMobilePushCampaignResponseReport
    {
        CommonInfo connection;
        public DLMobilePushCampaignResponseReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushCampaignResponseReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> MaxCount(MLMobilePushCampaignResponseReport mobpushReport, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from mobilepush_customreport_getcount(@MobilePushSendingSettingId, @Sent, @NotSent, @IsViewed, @IsClicked, @IsClosed, @IsUnsubscribed, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { mobpushReport.MobilePushSendingSettingId, mobpushReport.Sent, mobpushReport.NotSent, mobpushReport.IsViewed, mobpushReport.IsClicked, mobpushReport.IsClosed, mobpushReport.IsUnsubscribed, mobpushReport.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<MLMobilePushCampaignResponseReport>> GetReportDetails(MLMobilePushCampaignResponseReport mobpushReport, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "mobilepush_customreport_getreportdata";
            object? param = new { mobpushReport.MobilePushSendingSettingId, mobpushReport.Sent, mobpushReport.NotSent, mobpushReport.IsViewed, mobpushReport.IsClicked, mobpushReport.IsClosed, mobpushReport.IsUnsubscribed, mobpushReport.WorkFlowId, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobilePushCampaignResponseReport>(storeProcCommand, param)).ToList();
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
