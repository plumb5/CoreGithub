﻿using Dapper;
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
    public class DLWebPushBulkSentSQL : CommonDataBaseInteraction, IDLWebPushBulkSent
    {
        CommonInfo connection;
        public DLWebPushBulkSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushBulkSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WebPushSendingSetting>> GetBulkWebPushSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "WebPush_BulkSent";
            object? param = new { Action = "GetBulkWebPushSendingSettingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<WebPushSent>> GetBulkWebPushSentDetails(int WebPushSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "WebPush_BulkSent";
            object? param = new { Action = "GetWebPushSendingContacts", WebPushSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> UpdateBulkWebPushSentDetails(List<Int64> WebPushBulkSentIds)
        {
            string storeProcCommand = "WebPush_BulkSent";
            object? param = new { Action = "UpdateWebPushSentContacts", WebPushBulkSentIds=string.Join(",", WebPushBulkSentIds) };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<long> GetTotalBulkPush(int WebPushSendingSettingId)
        {
            string storeProcCommand = "WebPush_BulkSent";
            object? param = new { Action="GetTotalBulkPush", WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> DeleteTotalBulkPush(int WebPushSendingSettingId)
        {
            string storeProcCommand = "WebPush_BulkSent";
            object? param = new { Action = "DeleteTotalBulkPush", WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
    }
}
