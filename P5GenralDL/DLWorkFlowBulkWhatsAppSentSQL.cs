﻿using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace P5GenralDL
{
    internal class DLWorkFlowBulkWhatsAppSentSQL : CommonDataBaseInteraction, IDLWorkFlowBulkWhatsAppSent
    {
        CommonInfo connection;
        public DLWorkFlowBulkWhatsAppSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_WebHookBulkInsert";

            object? param = new { Action= "DeleteAllTheDataWhichAreInQuque", WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<long> GetTotalBulkWhatsApp(int WhatsAppSendingSettingId, int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_WebHookBulkInsert";

            object? param = new { Action = "GetTotalBulkWhatsApp", WhatsAppSendingSettingId, WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<WorkFlowBulkWhatsAppSent>> GetDetailsForMessageUpdate(WorkFlowBulkWhatsAppSent whatsAppSent)
        {
            string storeProcCommand = "WorkFlow_WhatsAppSent";

            object? param = new {Action= "GetDetailsForMessageUpdate", whatsAppSent.WhatsappSendingSettingId, whatsAppSent.WorkFlowId, whatsAppSent.WorkFlowDataId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowBulkWhatsAppSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<WorkFlowBulkWhatsAppSent>> GetSendingSettingIds(WorkFlowBulkWhatsAppSent whatsAppSent)
        {
            string storeProcCommand = "WorkFlow_WhatsAppSent";
            object? param = new { Action = "GetBulkWhatsappSendingIds", whatsAppSent.SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowBulkWhatsAppSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async void UpdateMessageContent(DataTable AllData)
        {
            string storeProcCommand = "WorkFlow_WhatsAppSent";
            object? param = new { Action = "UpdateMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }
        public async void DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "workflow_whatsappsent_deletemessagecontent"; 
            object? param = new { Action = "DeleteMessageContent", AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
