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
    internal class DLCustomEventsSegmentBuilderSQL : CommonDataBaseInteraction, IDLCustomEventsSegmentBuilder
    {
        CommonInfo connection;

        public DLCustomEventsSegmentBuilderSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int32> Save(CustomEventsSegmentBuilder segmentBuilder)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action= "Save",segmentBuilder.UserInfoUserId, segmentBuilder.GroupId, segmentBuilder.Status, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.ExecutionType, segmentBuilder.ExecutionIntervalMinutes, segmentBuilder.OneTimeExecutionDateTime, segmentBuilder.EveryDayExecutionTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(CustomEventsSegmentBuilder segmentBuilder)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action = "Update", segmentBuilder.GroupId, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.UpdatedDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<CustomEventsSegmentBuilder>> GET(int GroupId)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action = "Get", GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsSegmentBuilder>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        public async Task<IEnumerable<MLSegmentOutputColumns>> GetTestResultByQuery(string FilterQuery)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";

            object? param = new {Action= "TestQuery" ,FilterQuery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSegmentOutputColumns>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<CustomEventsSegmentBuilder>> GetList(CustomEventsSegmentBuilder segmentBuilder, List<string> fieldName)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            string fieldNames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            object? param = new { Action = "GetList", segmentBuilder.Status, fieldNames };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<CustomEventsSegmentBuilder>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async void StartFilter(int SegmentBuilderId)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action = "StartFilter", SegmentBuilderId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateDeleteStatus(int GroupId)
        {
            string storeProcCommand = "CustomEvents_SegmentBuilder";
            object? param = new { Action = "UpdateDeleteStatus", GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
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
