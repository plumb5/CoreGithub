using Dapper;
using DBInteraction;
using Microsoft.Data.SqlClient;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebPushBulkSentDynamicContentPG : CommonDataBaseInteraction, IDLWebPushBulkSentDynamicContent
    {
        CommonInfo connection;
        public DLWebPushBulkSentDynamicContentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushBulkSentDynamicContentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WebPushSendingSetting>> GetBulkpushSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "select * from webpush_bulksentdynamiccontent_getbulkwebpushsendingids(@SendStatus)";
            object? param = new { SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param)).ToList();

        }

        public async Task<List<WebPushBulkSent>> GetDetailsForMessageUpdate(int WebPushSendingSettingId)
        {
            string storeProcCommand = "select * from webpush_bulksentdynamiccontent_getdetailsformessageupdate(@WebPushSendingSettingId)";
            object? param = new { WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushBulkSent>(storeProcCommand, param)).ToList();

        }

        public async Task UpdateMessageContent(DataTable AllData)
        {
            string storeProcCommand = "select * from webpush_bulksentdynamiccontent_updatemessagecontent(@AllData)";
            object? param = new { AllData };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "select * from webpush_bulksentdynamiccontent_deletemessagecontent(@AllData)";
            object? param = new { AllData };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }        

    }
}
