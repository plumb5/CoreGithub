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
    public class DLMailScheduledReportPG : CommonDataBaseInteraction, IDLMailScheduledReport
    {
        CommonInfo connection;
        public DLMailScheduledReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailScheduledReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null)
        {
            string storeProcCommand = "select mail_scheduledreport_getscheduledcount(@FromDateTime, @ToDateTime, @CampignName)";
            object? param = new { FromDateTime, ToDateTime, CampignName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null)
        {
            string storeProcCommand = "select * from mail_scheduledreport_getscheduled(@OffSet, @FetchNext, @FromDateTime, @ToDateTime, @CampignName)";
            object? param = new { OffSet, FetchNext, FromDateTime, ToDateTime, CampignName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailScheduled>(storeProcCommand, param)).ToList();
        }


        public async Task<bool> Delete(Int32 Id)
        {
            string storeProcCommand = "select mail_scheduledreport_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
