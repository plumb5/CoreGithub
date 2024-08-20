using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Globalization;

namespace P5GenralDL
{
    public class DLSmsDashboardReportPG : CommonDataBaseInteraction, IDLSmsDashboardReport
    {
        CommonInfo connection;

        public DLSmsDashboardReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsDashboardReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLSmsDashboardCampaignEffectiveness>> GetCampaignEffectivenessData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from sms_dashboardreport_çampaigneffectiveness(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardCampaignEffectiveness>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLSmsDashboardEngagement>> GetSmsDashboardEngagementData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from sms_dashboardreport_smsdashboardengagement(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardEngagement>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLSmsDashboardDelivery>> GetSmsDashboardDeliveryData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from sms_dashboardreport_smsdashboarddelivery(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardDelivery>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLSmsDashboardSmsPerformanceOverTime>> GetSmsPerformanceOverTimeData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from sms_dashboardreport_smsdashboardperformanceovertime(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardSmsPerformanceOverTime>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLSmsDashboardBouncedVsRejected>> GetSmsDashboardBouncedRejectedData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from sms_dashboardreport_smsdashboardbouncedvsrejected(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsDashboardBouncedVsRejected>(storeProcCommand, param)).ToList();
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