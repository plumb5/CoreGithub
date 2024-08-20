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
    public class DLLmsDashboardSQL : CommonDataBaseInteraction, IDLLmsDashboard
    {
        CommonInfo connection;
        public DLLmsDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<DataSet> GetSummary(string UserIdList, List<int> UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "Contact_LMS_DashboardOverview";
            object? param = new { Action = "GetSummary", UserIdList, UserGroupIdList=UserGroupIdList != null ? string.Join(",", UserGroupIdList) : "", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetSummaryDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetSummary", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        
        public async Task<DataSet> GetFollowUpsData(string UserIdList, List<int> UserGroupIdList,int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetFollowUpsData", UserIdList, UserGroupIdList=UserGroupIdList != null ? string.Join(",", UserGroupIdList) : "", OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> LeadWonLeadLost(int Duration, string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, string StageName, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "LeadWonLeadLost", Duration, UserIdList, UserGroupIdList, FromDateTime, ToDateTime, StageName, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> TopStages(string UserIdList, List<int> UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "Contact_LMS_DashboardOverview";
            object? param = new { Action = "TopStages", UserIdList, UserGroupIdList= UserGroupIdList != null ? string.Join(",", UserGroupIdList) : "", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> TopSources(string UserIdList, List<int> UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "Contact_LMS_DashboardOverview";
            object? param = new { Action = "TopSources", UserIdList, UserGroupIdList=UserGroupIdList != null ? string.Join(",", UserGroupIdList) : "", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> LableWiseLeadsCount(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "LabelWiseLeads", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetLeadCampaignDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetLeadCampaignDetails", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetAllStageWiseLeadsCount(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetAllStageWiseLeadsCount", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetAllSourceWiseLeadsCount(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetAllSourceWiseLeadsCount", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetFollowUpLeadsCount(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetFollowUpLeadsCount", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetTopPerformerByLeadLabel(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetTopPerformerByLeadLabel", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetSTAGEWISEVSLABELWISE(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetSTAGEWISEVSLABELWISE", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetSOURCEWISEVSLABELWISE(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetSOURCEWISEVSLABELWISE", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetSTAGEVSSOURCEWISE(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetSTAGEVSSOURCEWISE", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetRevenueDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderBy)
        {
            string storeProcCommand = "Contact_LMS_Dashboard";
            object? param = new { Action = "GetRevenueDetails", UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
