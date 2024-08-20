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
    public class DLSegmentBuilderPG : CommonDataBaseInteraction, IDLSegmentBuilder
    {
        CommonInfo connection;

        public DLSegmentBuilderPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSegmentBuilderPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SegmentBuilder segmentBuilder)
        {
            try
            {
                string storeProcCommand = "select segment_builder_save(@UserInfoUserId, @GroupId, @Status, @SegmentQuery, @SegmentJson, @ExecutionType, @ExecutionIntervalMinutes, @OneTimeExecutionDateTime, @EveryDayExecutionTime, @IsNewOrExisting, @IsIntervalOrOnce, @NoOfDays, @FromDate, @ToDate, @IsRecurring, @SegmentQueryRecurring)";
                object? param = new { segmentBuilder.UserInfoUserId, segmentBuilder.GroupId, segmentBuilder.Status, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.ExecutionType, segmentBuilder.ExecutionIntervalMinutes, segmentBuilder.OneTimeExecutionDateTime, segmentBuilder.EveryDayExecutionTime, segmentBuilder.IsNewOrExisting, segmentBuilder.IsIntervalOrOnce, segmentBuilder.NoOfDays, segmentBuilder.FromDate, segmentBuilder.ToDate, segmentBuilder.IsRecurring, segmentBuilder.SegmentQueryRecurring };
                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        public async Task<bool>  Update(SegmentBuilder segmentBuilder)
        {
            string storeProcCommand = "select segment_builder_update(@GroupId, @SegmentQuery, @SegmentJson, @UpdatedDate, @IsNewOrExisting, @IsIntervalOrOnce, @NoOfDays, @FromDate, @ToDate, @IsRecurring, @SegmentQueryRecurring)";
            object? param = new { segmentBuilder.GroupId, segmentBuilder.SegmentQuery, segmentBuilder.SegmentJson, segmentBuilder.UpdatedDate, segmentBuilder.IsNewOrExisting, segmentBuilder.IsIntervalOrOnce, segmentBuilder.NoOfDays, segmentBuilder.FromDate, segmentBuilder.ToDate, segmentBuilder.IsRecurring, segmentBuilder.SegmentQueryRecurring };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<SegmentBuilder>> GET(int GroupId)
        {
            string storeProcCommand = "select * from segment_builder_get(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentBuilder>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLSegmentOutputColumns>> GetTestResultByQuery(string FilterQuery)
        {
            try
            {
                string storeProcCommand = "select * from segment_builder_testquery(@FilterQuery)";
                object? param = new { FilterQuery };
                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<MLSegmentOutputColumns>(storeProcCommand, param);
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<IEnumerable<SegmentBuilder>> GetList(SegmentBuilder segmentBuilder, List<string> fieldName)
        {
            string storeProcCommand = "select * from segment_builder_getlist(@Status, @IsIntervalOrOnce, @IsNewOrExisting)";
            object? param = new { segmentBuilder.Status, segmentBuilder.IsIntervalOrOnce, segmentBuilder.IsNewOrExisting };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentBuilder>(storeProcCommand, param);
        }
         
        public async void StartFilter(int SegmentBuilderId, bool IsIntervalOrOnce)
        {
            string storeProcCommand = "select segment_builder_startfilter(@SegmentBuilderId, @IsIntervalOrOnce)";
            object? param = new { SegmentBuilderId, IsIntervalOrOnce };
            using var db = GetDbConnection(connection.Connection);
             
            await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }

        public async Task<bool> UpdateDeleteStatus(int GroupId)
        {
            string storeProcCommand = "select segment_builder_updatedeletestatus(@GroupId)";

            object? param = new {  GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<IEnumerable<MLSegmentOutputColumns>>  GetCustomEventsTestResultByQuery(string FilterQuery)
        {
            string storeProcCommand = "select * from customevents_segmentbuilder_testquery(@FilterQuery)";
            object? param = new { FilterQuery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSegmentOutputColumns>(storeProcCommand, param);
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
