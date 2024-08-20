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
    public class DLSmsReportDetailsSQL : CommonDataBaseInteraction, IDLSmsReportDetails
    {
        CommonInfo connection;
        public DLSmsReportDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsReportDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> MaxCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "SMS_ResponseCustomReport";
            object? param = new { Action="GetCount", sentContactDetails.SmsSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.NotDeliverStatus, sentContactDetails.Pending, sentContactDetails.MobileNumber, sentContactDetails.Circle, sentContactDetails.Operator, sentContactDetails.SendStatus, sentContactDetails.ReasonForNotDelivery, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<MLSmsReportDetails>> GetReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "SMS_ResponseCustomReport";
            object? param = new { Action = "GetReportData", sentContactDetails.SmsSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.NotDeliverStatus, sentContactDetails.Pending, sentContactDetails.MobileNumber, sentContactDetails.Circle, sentContactDetails.Operator, sentContactDetails.SendStatus, OffSet, FetchNext, sentContactDetails.ReasonForNotDelivery, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsReportDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> GetMaxClickCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "SMS_ResponseCustomReport";
            object? param = new { Action = "GetClickCount", sentContactDetails.SmsSendingSettingId, sentContactDetails.WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLSmsReportDetails>> GetClickReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "SMS_ResponseCustomReport";
            object? param = new { Action = "GetClickReportData", sentContactDetails.SmsSendingSettingId, sentContactDetails.IsClicked, OffSet, FetchNext, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsReportDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLMailSmsBounced>> GetBouncedDetails(int SMSSendingSettingId)
        {
            string storeProcCommand = "SMS_ResponseCustomReport";
            object? param = new { Action = "GetBouncedDetails", SMSSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLMailSmsBounced>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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


