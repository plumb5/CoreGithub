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
    public class DLSmsBulkSentTimeSplitSQL : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplit
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(byte SendStatus)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action = "GetBulkSMSSendingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplit>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<SmsSent>> GetSMSSentContacts(int SmsSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action = "GetSMSSentContacts", SmsSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

            
        }

        public async Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action = "UpdateSmsSentContacts", SmsBulkSentIds=string.Join(",", SmsBulkSentIds) };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<long> GetTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action= "GetTotalBulkSms", SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action = "DeleteTotalBulkSms", SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
    }
}
