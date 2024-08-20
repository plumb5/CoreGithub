using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System;

namespace P5GenralDL
{
    public class DLMailCampaignResponseReportPG : CommonDataBaseInteraction, IDLMailCampaignResponseReport
    {
        CommonInfo connection = null;
        public DLMailCampaignResponseReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampaignResponseReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from mail_customreport_getcount(@MailSendingSettingId, @Sent, @NotSent, @Opened, @Clicked, @Forward, @Unsubscribe, @IsBounced, @DripSequence, @DripConditionType, @EmailId, @BouncedReason, @WorkFlowId, @FromDateTime, @ToDateTime, @Delivered)";
            object? param = new { sentContactDetails.MailSendingSettingId, sentContactDetails.Sent, sentContactDetails.NotSent, sentContactDetails.Opened, sentContactDetails.Clicked, sentContactDetails.Forward, sentContactDetails.Unsubscribe, sentContactDetails.IsBounced, sentContactDetails.DripSequence, sentContactDetails.DripConditionType, sentContactDetails.EmailId, sentContactDetails.BouncedReason, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime, sentContactDetails.Delivered };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailCampaignResponseReport>> GetReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select *  from mail_customreport_getreportdata(@MailSendingSettingId, @Sent, @NotSent, @Opened, @Clicked, @Forward, @Unsubscribe, @IsBounced, @OffSet, @FetchNext, @DripSequence, @DripConditionType, @EmailId, @BouncedReason, @WorkFlowId, @FromDateTime, @ToDateTime, @Delivered)";
            object? param = new { sentContactDetails.MailSendingSettingId, sentContactDetails.Sent, sentContactDetails.NotSent, sentContactDetails.Opened, sentContactDetails.Clicked, sentContactDetails.Forward, sentContactDetails.Unsubscribe, sentContactDetails.IsBounced, OffSet, FetchNext, sentContactDetails.DripSequence, sentContactDetails.DripConditionType, sentContactDetails.EmailId, sentContactDetails.BouncedReason, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime, sentContactDetails.Delivered };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponseReport>(storeProcCommand, param)).ToList();
        }
        public async Task<List<MLMailSmsBounced>> GetBouncedDetails(int MailSendingSettingId)
        {
            string storeProcCommand = "select *  from mail_customreport_getbounceddetails(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSmsBounced>(storeProcCommand, param)).ToList();
        }
        public async Task<int> GetMaxClickCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from mail_customreport_getclickcount(@MailSendingSettingId, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { sentContactDetails.MailSendingSettingId, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailCampaignResponseReport>> GetClickReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select *  from mail_customreport_getclickreportdata(@MailSendingSettingId, @OffSet, @FetchNext, @FromDateTime, @ToDateTime, @WorkFlowId)";
            object? param = new { sentContactDetails.MailSendingSettingId, OffSet, FetchNext, FromDateTime, ToDateTime, sentContactDetails.WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponseReport>(storeProcCommand, param)).ToList();
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
