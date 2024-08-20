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
    public class DLWebPushBulkSentPG : CommonDataBaseInteraction, IDLWebPushBulkSent
    {
        CommonInfo connection;
        public DLWebPushBulkSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushBulkSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WebPushSendingSetting>> GetBulkWebPushSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "select * from WebPush_BulkSent(@Action,@SendStatus)";
            object? param = new { Action = "GetBulkWebPushSendingSettingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task<List<WebPushSent>> GetBulkWebPushSentDetails(int WebPushSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "select * from webpush_bulksent_getwebpushsendingcontacts(@WebPushSendingSettingId, @MaxLimit)";
            object? param = new { WebPushSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSent>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateBulkWebPushSentDetails(List<Int64> WebPushBulkSentIds)
        {
            string storeProcCommand = "select * from webpush_bulksent_updatewebpushsentcontacts(@WebPushBulkSentIds)";
            object? param = new { WebPushBulkSentIds = string.Join(",", WebPushBulkSentIds) };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<long> GetTotalBulkPush(int WebPushSendingSettingId)
        {
            string storeProcCommand = "select * from webpush_bulksent_gettotalbulkpush(@WebPushSendingSettingId)";
            object? param = new { WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);

        }

        public async Task<bool> DeleteTotalBulkPush(int WebPushSendingSettingId)
        {
            string storeProcCommand = "select * from webpush_bulksent_deletetotalbulkpush(@WebPushSendingSettingId)";
            object? param = new { WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
    }
}
