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
    public class DLSmsBulkSentTimeSplitSchedulePG : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitSchedule
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitSchedulePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitSchedulePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_schedule_save( @SmsSendingSettingId, @IsPercentageORCount, @ValueOfPercentOrCount, @OffSet, @FetchNext, @ScheduleDate)";
            object? param = new { SmsBulkSentTimeSplitSchedule.SmsSendingSettingId, SmsBulkSentTimeSplitSchedule.IsPercentageORCount, SmsBulkSentTimeSplitSchedule.ValueOfPercentOrCount, SmsBulkSentTimeSplitSchedule.OffSet, SmsBulkSentTimeSplitSchedule.FetchNext, SmsBulkSentTimeSplitSchedule.ScheduleDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<SmsBulkSentTimeSplitSchedule>> GetSmsBulkSentTimeSplitScheduleDetails(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_schedule_getdetails(@SmsSendingSettingId)";
            object? param = new { SmsBulkSentTimeSplitSchedule.SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplitSchedule>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateScheduledDate(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_schedule_updatescheduleddate(@Id,@ScheduleDate )";
            object? param = new { SmsBulkSentTimeSplitSchedule.Id, SmsBulkSentTimeSplitSchedule.ScheduleDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> DeleteById(int Id)
        {
            string storeProcCommand = "select * from UpdateScore(@Action,@Id)";
            object? param = new { Action = "DeleteById", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> GetBulkSentCount(DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from SmsBulkSentTime_Split_Schedule(@Action,@FromDateTime, @ToDateTime)";
            object? param = new { Action = "GetBulkSentCount", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLSmsBulkSentTimeSplitScheduleReport>> GetBulkSentList(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from SmsBulkSentTime_Split_Schedule(@Action,@FromDateTime, @ToDateTime, @OffSet, @FetchNext)";
            object? param = new { Action = "GetBulkSentList", FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsBulkSentTimeSplitScheduleReport>(storeProcCommand, param)).ToList();

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
