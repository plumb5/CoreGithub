using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IP5GenralDL;
using Dapper;

namespace P5GenralDL
{
    public class DLWhatsAppReportDetailsPG : CommonDataBaseInteraction, IDLWhatsAppReportDetails
    {
        CommonInfo connection;
        public DLWhatsAppReportDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<int> MaxCount(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            try
            {
                string storeProcCommand = "select whatsapp_responsecustomreport_getcount(@WhatsAppSendingSettingId, @IsDelivered, @IsClicked, @IsRead, @IsFailed, @SendStatus, @ErrorMessage, @IsUnsubscribed, @WorkFlowId, @FromDateTime, @ToDateTime)";
                object? param = new { sentContactDetails.WhatsAppSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.IsRead, sentContactDetails.IsFailed, sentContactDetails.SendStatus, sentContactDetails.ErrorMessage, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        public async Task<List<MLWhatsAppReportDetails>> GetReportDetails(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime, int OffSet = 0, int FetchNext = 0)
        {
            string storeProcCommand = "select * from whatsapp_responsecustomreport_getreportdata(@WhatsAppSendingSettingId, @IsDelivered, @IsClicked, @IsRead, @IsFailed, @SendStatus, @ErrorMessage, @IsUnsubscribed, @WorkFlowId, @FromDateTime, @ToDateTime, @OffSet, @FetchNext)";
            object? param = new { sentContactDetails.WhatsAppSendingSettingId, sentContactDetails.IsDelivered, sentContactDetails.IsClicked, sentContactDetails.IsRead, sentContactDetails.IsFailed, sentContactDetails.SendStatus, sentContactDetails.ErrorMessage, sentContactDetails.IsUnsubscribed, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppReportDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLMailSmsBounced>> GetBouncedDetails(int WhatsAppSendingSettingId)
        {
            string storeProcCommand = "select * from whatsapp_responsecustomreport_getbounceddetails(@WhatsAppSendingSettingId)";
            object? param = new { WhatsAppSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSmsBounced>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLWhatsAppReportDetails>> GetClickReportDetails(MLWhatsAppReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from whatsapp_responsecustomreport_getclickreportdata(@WhatsAppSendingSettingId, @IsClicked, @OffSet, @FetchNext, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { sentContactDetails.WhatsAppSendingSettingId, sentContactDetails.IsClicked, OffSet, FetchNext, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppReportDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<int> GetMaxClickCount(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select whatsapp_responsecustomreport_getclickcount(@WhatsAppSendingSettingId, @IsClicked, @WorkFlowId, @FromDateTime, @ToDateTime)";
            object? param = new { sentContactDetails.WhatsAppSendingSettingId, sentContactDetails.IsClicked, sentContactDetails.WorkFlowId, FromDateTime, ToDateTime };

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
