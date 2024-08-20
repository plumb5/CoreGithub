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
    internal class DLDashboardMailAlertSQL : CommonDataBaseInteraction, IDLDashboardMailAlert
    {
        CommonInfo connection = null;
        public DLDashboardMailAlertSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLDashboardMailAlertSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "Save", mailAlert.DashboardId, mailAlert.MailAlertType, mailAlert.ToEmailId, mailAlert.CCFromEmailId, mailAlert.IsDaily, mailAlert.IsFornightly, mailAlert.IsWeekly, mailAlert.IsMonthly, mailAlert.IsQuarterly };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DashboardMailAlert?> GetDetail(int Id)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "GET", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<DashboardMailAlert?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "GET", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<IEnumerable<DashboardMailAlert>> GetAllMailAlerts()
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "GETALL" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<DashboardMailAlert>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> UpdateLastWeeklyTriggerDate(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "UpdateWeeklyTriggerDate", mailAlert.DashboardId, mailAlert.LastWeeklyTriggerDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateLastFornightlyTriggerDate(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "UpdateFornightlyTriggerDate", mailAlert.DashboardId, mailAlert.LastFornightlyTriggerDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateLastMonthlyTriggerDate(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "UpdateMonthlyTriggerDate", mailAlert.DashboardId, mailAlert.LastMonthlyTriggerDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateLastQuarterlyTriggerDate(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "UpdateQuarterlyTriggerDate", mailAlert.DashboardId, mailAlert.LastQuarterlyTriggerDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateLastDailyTriggerDate(DashboardMailAlert mailAlert)
        {
            string storeProcCommand = "Dashboard_MailAlert";
            object? param = new { Action = "LastDailyTriggerDate", mailAlert.DashboardId, mailAlert.LastDailyTriggerDate };
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
