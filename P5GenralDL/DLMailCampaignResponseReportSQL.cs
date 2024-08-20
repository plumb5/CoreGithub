using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailCampaignResponseReportSQL : CommonDataBaseInteraction, IDLMailCampaignResponseReport
    {
        CommonInfo connection = null;
        public DLMailCampaignResponseReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampaignResponseReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "Mail_CustomReport";
            object? param = new { @Action = "GetCount", sentContactDetails.MailSendingSettingId, sentContactDetails.Sent, sentContactDetails.NotSent, sentContactDetails.Opened, sentContactDetails.Clicked, sentContactDetails.Forward, sentContactDetails.Unsubscribe, sentContactDetails.IsBounced, sentContactDetails.DripSequence, sentContactDetails.DripConditionType, sentContactDetails.EmailId, sentContactDetails.BouncedReason, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime, sentContactDetails.Delivered };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailCampaignResponseReport>> GetReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "Mail_CustomReport";
            object? param = new { @Action = "GetReportData", sentContactDetails.MailSendingSettingId, sentContactDetails.Sent, sentContactDetails.NotSent, sentContactDetails.Opened, sentContactDetails.Clicked, sentContactDetails.Forward, sentContactDetails.Unsubscribe, sentContactDetails.IsBounced, OffSet, FetchNext, sentContactDetails.DripSequence, sentContactDetails.DripConditionType, sentContactDetails.EmailId, sentContactDetails.BouncedReason, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime, sentContactDetails.Delivered };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponseReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<MLMailSmsBounced>> GetBouncedDetails(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_CustomReport";
            object? param = new { @Action = "GetBouncedDetails", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSmsBounced>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<int> GetMaxClickCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "Mail_CustomReport";
            object? param = new { @Action = "GetClickCount", sentContactDetails.MailSendingSettingId, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailCampaignResponseReport>> GetClickReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "Mail_CustomReport";
            object? param = new { @Action = "GetClickReportData", sentContactDetails.MailSendingSettingId, OffSet, FetchNext, FromDateTime, ToDateTime, sentContactDetails.WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponseReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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

