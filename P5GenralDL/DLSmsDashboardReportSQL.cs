using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Globalization;
using System.Data;

namespace P5GenralDL
{
    public class DLSmsDashboardReportSQL : CommonDataBaseInteraction, IDLSmsDashboardReport
    {
        CommonInfo connection;

        public DLSmsDashboardReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsDashboardReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLSmsDashboardCampaignEffectiveness>> GetCampaignEffectivenessData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "Sms_DashboardReport";
            object? param = new { @Action = "ÇampaignEffectiveness", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardCampaignEffectiveness>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSmsDashboardEngagement>> GetSmsDashboardEngagementData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "Sms_DashboardReport";
            object? param = new { @Action = "SmsDashboardEngagement", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardEngagement>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSmsDashboardDelivery>> GetSmsDashboardDeliveryData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "Sms_DashboardReport";
            object? param = new { @Action = "SmsDashboardDelivery", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardDelivery>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSmsDashboardSmsPerformanceOverTime>> GetSmsPerformanceOverTimeData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "Sms_DashboardReport";
            object? param = new { @Action = "SmsDashboardPerformanceOverTime", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardSmsPerformanceOverTime>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSmsDashboardBouncedVsRejected>> GetSmsDashboardBouncedRejectedData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "Sms_DashboardReport";
            object? param = new { @Action = "SmsDashboardBouncedVsRejected", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardBouncedVsRejected>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}