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
    public class DLMobileInAppDashBoardSQL : CommonDataBaseInteraction, IDLMobileInAppDashBoard
    {
        CommonInfo connection;
        public DLMobileInAppDashBoardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppDashBoardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<MLMobileInAppDashBoard?> GetPlatformDistribution(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mobile_InAppDashBoard";
            object? param = new { Action = "GetPlatformDistribution", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileInAppDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLMobileInAppDashBoard>> TotalInAppFormSubmissions(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mobile_InAppDashBoard";
            object? param = new { Action = "TotalInAppFormSubmissions", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileInAppDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<MLMobileInAppDashBoard>> TopFivePerFormingInApp(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mobile_InAppDashBoard";
            object? param = new { Action = "TopFivePerFormingInApp", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileInAppDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<MLMobileInAppDashBoard?> AggregateInAppData(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mobile_InAppDashBoard";
            object? param = new { Action = "AggregateInAppData", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileInAppDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
