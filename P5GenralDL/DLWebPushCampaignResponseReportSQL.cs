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
    public class DLWebPushCampaignResponseReportSQL : CommonDataBaseInteraction, IDLWebPushCampaignResponseReport
    {
        CommonInfo connection;

        public DLWebPushCampaignResponseReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushCampaignResponseReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLWebPushCampaignResponseReport webpushReport, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "WebPush_CustomReport";
            object? param = new { Action= "GetCount", webpushReport.WebPushSendingSettingId, webpushReport.Sent, webpushReport.NotSent, webpushReport.IsViewed, webpushReport.IsClicked, webpushReport.IsClosed, webpushReport.IsUnsubscribed, webpushReport.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLWebPushCampaignResponseReport>> GetReportDetails(MLWebPushCampaignResponseReport webpushReport, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "WebPush_CustomReport";
            object? param = new { Action = "GetReportData", webpushReport.WebPushSendingSettingId, webpushReport.Sent, webpushReport.NotSent, webpushReport.IsViewed, webpushReport.IsClicked, webpushReport.IsClosed, webpushReport.IsUnsubscribed, OffSet, FetchNext, webpushReport.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWebPushCampaignResponseReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
