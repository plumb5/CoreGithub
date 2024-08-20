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
    public class DLCustomEventsOverViewSQL : CommonDataBaseInteraction, IDLCustomEventsOverView
    {
        CommonInfo connection = null;
        public DLCustomEventsOverViewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCustomEventsOverViewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(CustomEventsOverView customevntsoverview)
        {
            string storeProcCommand = "Custom_EventsOverView";
            object? param = new {Action="Save", customevntsoverview.EventName, customevntsoverview.TotalEventCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<CustomEventsOverView?> GetCustomEventByName(string CustomEventName)
        {
            string storeProcCommand = "Custom_EventsOverView";
            object? param = new { Action = "GetCustomEventDetails", CustomEventName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CustomEventsOverView?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> MaxCount(string CustomEventName, DateTime fromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Custom_EventsOverView";

            object? param = new { Action = "MaxCount", CustomEventName, fromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<CustomEventsOverView>> GetReportData(string CustomEventName, Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Custom_EventsOverView";
            object? param = new { Action = "GetCustomEventDetails", CustomEventName, fromDateTime, ToDateTime, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> DeleteCustomEventOverView(int Id)
        {
            string storeProcCommand = "Custom_EventsOverView";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }
        public async Task<Int32> StopCustomEventTrack(int Id)
        {
            string storeProcCommand = "Custom_EventsOverView";
            object? param = new { Action = "StopTrack", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CustomEventsNames>> GetCustomEventsNames()
        {
            string storeProcCommand = "Custom_EventsOverView";
            List<string> paramName = new List<string> { };
            object? param = new { Action = "GetCustomEventDetails" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsNames>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLCustomEventsOverViewMappings>> GetCustomEventsColumnNames(int CustomEventOverViewId)
        {
            string storeProcCommand = "CustomEvents_OverView";

            object? param = new { Action = "GetCustomEventsColumnNames", CustomEventOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLCustomEventsOverViewMappings>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CustomEventsOverView>> GetEventNamesForRevenue(Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "Custom_EventsOverView";

            object? param = new { Action = "GetRevenueCustomEventDetails", fromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsOverView>(storeProcCommand, param);
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
