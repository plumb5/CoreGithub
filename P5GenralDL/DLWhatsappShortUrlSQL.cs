﻿using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLWhatsappShortUrlSQL : CommonDataBaseInteraction, IDLWhatsappShortUrl
    {
        CommonInfo connection;
        public DLWhatsappShortUrlSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<long> Save(WhatsappShortUrl ShortUrl)
        {
            string storeProcCommand = "WhatsAppShortUrl_Details";
            object? param = new { Action = "Save", ShortUrl.AccountId, ShortUrl.URLId, ShortUrl.WhatsappSendingSettingId, ShortUrl.WorkflowId, ShortUrl.CampaignType, ShortUrl.P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<WhatsappShortUrl?> GetDetailsAsync(long SmsShortUrlId)
        {
            string storeProcCommand = "WhatsAppShortUrl_Details";
            object? param = new { Action = "GetDetails", SmsShortUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsappShortUrl>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
