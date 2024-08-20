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
    public class DLMobilePushDashboardPG : CommonDataBaseInteraction, IDLMobilePushDashboard
    {
        private CommonInfo connection;
        public DLMobilePushDashboardPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushDashboardPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<MLMobilePushDashboard?> GetSubcribersDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "select * from mobilepush_dashboard_getsubcribersdetails(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobilePushDashboard?>(storeProcCommand, param);
        }

        public async Task<MLMobilePushDashboard?> GetCampaignDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "select * from mobilepush_dashboard_getcampaigndetails(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobilePushDashboard?>(storeProcCommand, param);
        }

        public async Task<List<MLMobilePushDashboard>> GetNotificationDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "select * from mobilepush_dashboard_getnotificationdetails(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobilePushDashboard>(storeProcCommand, param)).ToList();
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
