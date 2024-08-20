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
    public class DLSegmentBuilderSQL : CommonDataBaseInteraction, IDLSegmentBuilder
    {
        CommonInfo connection;

        public DLSegmentBuilderSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSegmentBuilderSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SegmentBuilder segmentBuilder)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action= "Save", segmentBuilder.UserInfoUserId, segmentBuilder.GroupId, segmentBuilder.Status, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.ExecutionType, segmentBuilder.ExecutionIntervalMinutes, segmentBuilder.OneTimeExecutionDateTime, segmentBuilder.EveryDayExecutionTime, segmentBuilder.IsNewOrExisting, segmentBuilder.IsIntervalOrOnce, segmentBuilder.NoOfDays, segmentBuilder.FromDate, segmentBuilder.ToDate, segmentBuilder.IsRecurring, segmentBuilder.SegmentQueryRecurring };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(SegmentBuilder segmentBuilder)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action = "Update", segmentBuilder.GroupId, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.UpdatedDate, segmentBuilder.IsNewOrExisting, segmentBuilder.IsIntervalOrOnce, segmentBuilder.NoOfDays, segmentBuilder.FromDate, segmentBuilder.ToDate, segmentBuilder.IsRecurring, segmentBuilder.SegmentQueryRecurring };
            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<IEnumerable<SegmentBuilder>> GET(int GroupId)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action = "Get", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentBuilder>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<MLSegmentOutputColumns>> GetTestResultByQuery(string FilterQuery)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action = "TestQuery", FilterQuery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSegmentOutputColumns>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<SegmentBuilder>> GetList(SegmentBuilder segmentBuilder, List<string> fieldName)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action = "GetList", segmentBuilder.Status, segmentBuilder.IsIntervalOrOnce, segmentBuilder.IsNewOrExisting };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentBuilder>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
         
        public async void StartFilter(int SegmentBuilderId, bool IsIntervalOrOnce)
        {
            string storeProcCommand = "Segment_Builder";
            object? param = new { Action = "StartFilter", SegmentBuilderId, IsIntervalOrOnce };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateDeleteStatus(int GroupId)
        {
            string storeProcCommand = "Segment_Builder";

            object? param = new { Action = "UpdateDeleteStatus", GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }

        public async Task<IEnumerable<MLSegmentOutputColumns>> GetCustomEventsTestResultByQuery(string FilterQuery)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action = "TestQuery", FilterQuery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSegmentOutputColumns>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

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
