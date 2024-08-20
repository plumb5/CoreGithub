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
    public class DLWhatsappBulkSentDynamicContentSQL : CommonDataBaseInteraction, IDLWhatsappBulkSentDynamicContent
    {
        CommonInfo connection;

        public DLWhatsappBulkSentDynamicContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async void DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "Whatsapp_BulkSentDynamicContent";

            object? param = new {Action= "DeleteMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateMessageContent(DataTable AllMessageContent)
        {
            string storeProcCommand = "Whatsapp_BulkSentDynamicContent";
            object? param = new { Action = "UpdateMessageContent", AllMessageContent };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }

        public async Task<IEnumerable<WhatsappBulkSent>> GetDetailsForMessageUpdate(int WhatsappSendingSettingId)
        {
            string storeProcCommand = "Whatsapp_BulkSentDynamicContent";

            object? param = new { Action = "GetDetailsForMessageUpdate", WhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WhatsappBulkSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<WhatsAppSendingSetting>> GetBulkAppSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "Whatsapp_BulkSentDynamicContent";
            object? param = new { Action = "GetBulkWhatsappSendingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WhatsAppSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<WhatsAppSendingSetting?> GetDetail(int Id)
        {
            string name = "";
            int whatsapptemplateid = 0;
            int groupid = 0;
            string storeProcCommand = "select * from whatsapp_sendingsetting_get(@Id,@name,@whatsapptemplateid,@groupid)";
            object? param = new { Id, name, whatsapptemplateid, groupid };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppSendingSetting?>(storeProcCommand, param);
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

