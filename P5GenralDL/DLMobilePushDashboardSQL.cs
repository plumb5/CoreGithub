using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobilePushDashboardSQL : CommonDataBaseInteraction, IDLMobilePushDashboard
    {
        private CommonInfo connection;
        public DLMobilePushDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<MLMobilePushDashboard?> GetSubcribersDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "MobilePush_DashBoard";
            object? param = new { Action = "GetSubcribersDetails", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobilePushDashboard?>(storeProcCommand, param);
        }

        public async Task<MLMobilePushDashboard?> GetCampaignDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "MobilePush_DashBoard";
            object? param = new { Action = "GetCampaignDetails", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobilePushDashboard?>(storeProcCommand, param);
        }

        public async Task<List<MLMobilePushDashboard>> GetNotificationDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            const string storeProcCommand = "MobilePush_DashBoard";
            object? param = new { Action = "GetNotificationDetails", FromDateTime, ToDateTime };

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
