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
    public class DLCustomEventsOverViewPG : CommonDataBaseInteraction, IDLCustomEventsOverView
    {
        CommonInfo connection = null;
        public DLCustomEventsOverViewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCustomEventsOverViewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(CustomEventsOverView customevntsoverview)
        {
            string storeProcCommand = "select custom_eventsoverview_save(@EventName,@TotalEventCount)"; 
            object? param = new { customevntsoverview.EventName, customevntsoverview.TotalEventCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<CustomEventsOverView?> GetCustomEventByName(string CustomEventName)
        {
            string storeProcCommand = "select * from custom_eventsoverview_getcustomeventnamedetails(@CustomEventName)"; 
            object? param = new { CustomEventName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CustomEventsOverView?>(storeProcCommand, param);
        }

        public async Task<Int32> MaxCount(string CustomEventName, DateTime fromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select custom_eventsoverview_maxcount(@CustomEventName, @fromDateTime, @ToDateTime)";
             
            object? param = new { CustomEventName, fromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<IEnumerable<CustomEventsOverView>> GetReportData(string CustomEventName, Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from custom_eventsoverview_getcustomeventdetails(@CustomEventName, @fromDateTime, @ToDateTime, @OffSet, @FetchNext )";
            object? param = new { CustomEventName, fromDateTime, ToDateTime, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsOverView>(storeProcCommand, param);
        }
        public async Task<bool> DeleteCustomEventOverView(int Id)
        {
            string storeProcCommand = "select custom_eventsoverview_delete(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }
        public async Task<Int32> StopCustomEventTrack(int Id)
        {
            string storeProcCommand = "select custom_eventsoverview_stoptrack(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<CustomEventsNames>> GetCustomEventsNames()
        {
            string storeProcCommand = "select * from customevents_overview_getcustomeventsnames()";
            List<string> paramName = new List<string> { };
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsNames>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLCustomEventsOverViewMappings>> GetCustomEventsColumnNames(int CustomEventOverViewId)
        {
            string storeProcCommand = "select * from customevents_overview_getcustomeventscolumnnames(@CustomEventOverViewId)";
             
            object? param = new { CustomEventOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLCustomEventsOverViewMappings>(storeProcCommand, param);
        }

        public async Task<IEnumerable<CustomEventsOverView>> GetEventNamesForRevenue(Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "select * from custom_eventsoverview_getrevenuecustomeventdetails(@fromDateTime, @ToDateTime)";
             
            object? param = new { fromDateTime, ToDateTime };
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
