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

namespace P5GenralDL
{
    public class DLWhatsAppBulkSentSQL : CommonDataBaseInteraction, IDLWhatsAppBulkSent
    {
        CommonInfo connection;

        public DLWhatsAppBulkSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<MLWhatsappSent>> GetBulkWhatsappSentDetails(int WhatsappSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "WhatsApp_BulkSent";

            object? param = new { Action= "GetWhatsappSentContacts", WhatsappSendingSettingId, MaxLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsappSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateBulkWhatsappSentDetails(List<long> WhatsappBulkSentIds)
        {
            string WhatsappBulkSentId = string.Join(",", WhatsappBulkSentIds);
            string storeProcCommand = "WhatsApp_BulkSent";
            object? param = new { Action= "UpdateWhatsappSentContacts",WhatsappBulkSentId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<long> GetTotalBulkWhatsapp(int WhatsappSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_BulkSent";
            object? param = new { Action = "GetTotalBulkWhatsapp", WhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteTotalBulkWhatsapp(int WhatsappSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_BulkSent";
            object? param = new { Action = "DeleteTotalBulkWhatsapp", WhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

