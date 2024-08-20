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
    public class DLWhatsAppScheduledReportSQL : CommonDataBaseInteraction, IDLWhatsAppScheduledReport
    {
        CommonInfo connection;
        public DLWhatsAppScheduledReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null)
        {
            string storeProcCommand = "WhatsApp_ScheduledReport";
            object? param = new { Action = "GetScheduledCount", FromDateTime, ToDateTime, CampignName };

            var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLWhatsAppScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null)
        {
            string storeProcCommand = "WhatsApp_ScheduledReport";
            object? param = new { Action = "GetScheduled", OffSet, FetchNext, FromDateTime, ToDateTime, CampignName };

            var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppScheduled>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLWhatsAppScheduled>> GetScheduledDetailbyId(int SmsSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_ScheduledReport";
            object? param = new { Action = "GetScheduledDetailbyId", SmsSendingSettingId };

            var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppScheduled>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
