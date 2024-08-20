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
    internal class DLSmsReportDetailsPG : CommonDataBaseInteraction, IDLSmsReportDetails
    {
        CommonInfo connection;
        public DLSmsReportDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsReportDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> MaxCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select sms_responsecustomreport_getcount(@SmsSendingSettingId, @IsDelivered, @IsClicked, @NotDeliverStatus, @Pending, @MobileNumber, @Circle, @Operator, @SendStatus, @ReasonForNotDelivery, @IsUnsubscribed, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { sentContactDetails.SmsSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.NotDeliverStatus, sentContactDetails.Pending, sentContactDetails.MobileNumber, sentContactDetails.Circle, sentContactDetails.Operator, sentContactDetails.SendStatus, sentContactDetails.ReasonForNotDelivery, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLSmsReportDetails>> GetReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from sms_responsecustomreport_getreportdata(@SmsSendingSettingId, @IsDelivered, @IsClicked, @NotDeliverStatus, @Pending, @MobileNumber, @Circle, @Operator, @SendStatus, @OffSet, @FetchNext, @ReasonForNotDelivery, @IsUnsubscribed, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { sentContactDetails.SmsSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.NotDeliverStatus, sentContactDetails.Pending, sentContactDetails.MobileNumber, sentContactDetails.Circle, sentContactDetails.Operator, sentContactDetails.SendStatus, OffSet, FetchNext, sentContactDetails.ReasonForNotDelivery, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsReportDetails>(storeProcCommand, param);
        }

        public async Task<Int32> GetMaxClickCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select sms_responsecustomreport_getclickcount(@SmsSendingSettingId,@WorkFlowId)";
            object? param = new { sentContactDetails.SmsSendingSettingId, sentContactDetails.WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLSmsReportDetails>> GetClickReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from sms_responsecustomreport_getclickreportdata(@SmsSendingSettingId, @IsClicked, @OffSet, @FetchNext, @WorkFlowId, @FromDateTime, @ToDateTime  )";
            object? param = new { sentContactDetails.SmsSendingSettingId, sentContactDetails.IsClicked, OffSet, FetchNext, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsReportDetails>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLMailSmsBounced>> GetBouncedDetails(int SMSSendingSettingId)
        {
            string storeProcCommand = "select * from sms_responsecustomreport_getbounceddetails(@SMSSendingSettingId)";
            object? param = new { SMSSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLMailSmsBounced>(storeProcCommand, param);
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

