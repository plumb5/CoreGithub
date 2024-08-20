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
    public class DLMobileInAppDashBoardPG : CommonDataBaseInteraction, IDLMobileInAppDashBoard
    {
        CommonInfo connection;
        public DLMobileInAppDashBoardPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppDashBoardPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<MLMobileInAppDashBoard?> GetPlatformDistribution(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from mobile_inappdashboard_getplatformdistribution(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileInAppDashBoard?>(storeProcCommand, param);

        }

        public async Task<List<MLMobileInAppDashBoard>> TotalInAppFormSubmissions(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from mobile_inappdashboard_totalinappformsubmissions(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileInAppDashBoard>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLMobileInAppDashBoard>> TopFivePerFormingInApp(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from mobile_inappdashboard_topfiveperforminginapp(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileInAppDashBoard>(storeProcCommand, param)).ToList();

        }

        public async Task<MLMobileInAppDashBoard?> AggregateInAppData(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileInAppDashBoard?>(storeProcCommand, param);

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
