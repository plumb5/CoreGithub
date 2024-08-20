using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsBulkSentTimeSplitPG : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplit
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(byte SendStatus)
        {
            string storeProcCommand = "select * from SmsBulkSentTime_Split(@Action,@SendStatus)";
            object? param = new { Action = "GetBulkSMSSendingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplit>(storeProcCommand, param)).ToList();

        }

        public async Task<List<SmsSent>> GetSMSSentContacts(int SmsSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_getsmssentcontacts(@ SmsSendingSettingId, @MaxLimit)";
            object? param = new { SmsSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsSent>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_updatesmssentcontacts(@SmsBulkSentIds)";
            object? param = new { SmsBulkSentIds = string.Join(",", SmsBulkSentIds) };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<long> GetTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_gettotalbulksms(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);

        }

        public async Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from smsbulksenttime_split_deletetotalbulksms(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
    }
}
