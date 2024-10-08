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
    public class DLWhatsAppBulkSentPG : CommonDataBaseInteraction, IDLWhatsAppBulkSent
    {
        CommonInfo connection;

        public DLWhatsAppBulkSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<MLWhatsappSent>> GetBulkWhatsappSentDetails(int WhatsappSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "select * from whatsapp_bulksent_getwhatsappsentcontacts( @WhatsappSendingSettingId, @MaxLimit )";
             
            object? param = new { WhatsappSendingSettingId, MaxLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsappSent>(storeProcCommand, param);
        }

        public async Task<bool> UpdateBulkWhatsappSentDetails(List<long> WhatsappBulkSentIds)
        {
            string WhatsappBulkSentId = string.Join(",", WhatsappBulkSentIds);
            string storeProcCommand = "select whatsapp_bulksent_updatesmssentcontacts(@WhatsappBulkSentId)"; 
            object? param = new { WhatsappBulkSentId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;

        }

        public async Task<long>  GetTotalBulkWhatsapp(int WhatsappSendingSettingId)
        {
            string storeProcCommand = "select whatsapp_bulksent_gettotalbulkwhatsapp(@WhatsappSendingSettingId)"; 
            object? param = new { WhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> DeleteTotalBulkWhatsapp(int WhatsappSendingSettingId)
        {
            string storeProcCommand = "select whatsapp_bulksent_deletetotalbulkwhatsapp(@WhatsappSendingSettingId)"; 
            object? param = new { WhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
