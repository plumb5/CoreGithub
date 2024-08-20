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
    public class DLSmsScheduledReportSQL : CommonDataBaseInteraction, IDLSmsScheduledReport
    {

        CommonInfo connection;
        public DLSmsScheduledReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsScheduledReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null)
        {
            string storeProcCommand = "Sms_ScheduledReport";
            object? param = new {Action= "GetScheduledCount", FromDateTime, ToDateTime, CampignName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLSmsScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null)
        {
            string storeProcCommand = "Sms_ScheduledReport";
            object? param = new { Action = "GetScheduledCount", OffSet, FetchNext, FromDateTime, ToDateTime, CampignName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsScheduled>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<MLSmsScheduled>> GetScheduledDetailbyId(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_ScheduledReport";
            object? param = new { Action = "GetScheduledDetailbyId", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsScheduled>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
