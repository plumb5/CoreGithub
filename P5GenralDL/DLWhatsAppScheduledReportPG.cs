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
    public class DLWhatsAppScheduledReportPG : CommonDataBaseInteraction, IDLWhatsAppScheduledReport
    {
        CommonInfo connection;
        public DLWhatsAppScheduledReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null)
        {
            string storeProcCommand = "select whatsapp_scheduledreport_getscheduledcount(@FromDateTime, @ToDateTime, @CampignName)";
            object? param = new { FromDateTime, ToDateTime, CampignName };

            var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLWhatsAppScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null)
        {
            string storeProcCommand = "select * from whatsapp_scheduledreport_getscheduled(@OffSet, @FetchNext, @FromDateTime, @ToDateTime, @CampignName)";
            object? param = new { OffSet, FetchNext, FromDateTime, ToDateTime, CampignName };

            var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppScheduled>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLWhatsAppScheduled>> GetScheduledDetailbyId(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from whatsapp_scheduledreport_getscheduleddetailbyid()";
            object? param = new { SmsSendingSettingId };

            var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppScheduled>(storeProcCommand, param)).ToList();
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
                    connection = null;
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

