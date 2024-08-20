using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebPushDashboardSQL : CommonDataBaseInteraction, IDLWebPushDashboard
    {
        CommonInfo connection;

        public DLWebPushDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<MLWebPushDashboard?> GetSubcribersDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "WebPush_DashBoard";
            object? param = new { Action = "GetSubcribersDetails", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLWebPushDashboard?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<MLWebPushDashboard?> GetCampaignDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "WebPush_DashBoard";
            object? param = new { Action = "GetCampaignDetails", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLWebPushDashboard?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLWebPushDashboard>> GetNotificationDetails(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "WebPush_DashBoard";
            object? param = new { Action = "GetNotificationDetails", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWebPushDashboard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
