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
    public class DLMailDashboardSQL : CommonDataBaseInteraction, IDLMailDashboard
    {
        CommonInfo connection;
        public DLMailDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLMailDashboard>> GetReport(int Duration, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mail_DashboardReport";
            object? param = new { Action = "DashboardReportDetails", Duration, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailDashboard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<MLMailDashboard>> FormImpressionData(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mail_DashboardReport";
            object? param = new { Action = "OverAllImpression", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailDashboard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
    }
}
