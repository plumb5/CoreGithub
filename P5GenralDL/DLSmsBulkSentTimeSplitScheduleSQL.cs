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
    public class DLSmsBulkSentTimeSplitScheduleSQL : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitSchedule
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitScheduleSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitScheduleSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "Save", SmsBulkSentTimeSplitSchedule.SmsSendingSettingId, SmsBulkSentTimeSplitSchedule.IsPercentageORCount, SmsBulkSentTimeSplitSchedule.ValueOfPercentOrCount, SmsBulkSentTimeSplitSchedule.OffSet, SmsBulkSentTimeSplitSchedule.FetchNext, SmsBulkSentTimeSplitSchedule.ScheduleDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<SmsBulkSentTimeSplitSchedule>> GetSmsBulkSentTimeSplitScheduleDetails(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "GetDetails", SmsBulkSentTimeSplitSchedule.SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplitSchedule>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();


        }

        public async Task<bool> UpdateScheduledDate(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "UpdateScheduledDate", SmsBulkSentTimeSplitSchedule.Id, SmsBulkSentTimeSplitSchedule.ScheduleDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> DeleteById(int Id)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "DeleteById", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<int> GetBulkSentCount(DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "GetBulkSentCount", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLSmsBulkSentTimeSplitScheduleReport>> GetBulkSentList(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "SmsBulkSentTime_Split_Schedule";
            object? param = new { Action = "GetBulkSentList", FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsBulkSentTimeSplitScheduleReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
