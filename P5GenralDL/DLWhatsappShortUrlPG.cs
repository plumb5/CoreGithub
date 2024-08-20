using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLWhatsappShortUrlPG : CommonDataBaseInteraction, IDLWhatsappShortUrl
    {
        CommonInfo connection;
        public DLWhatsappShortUrlPG()
        {
            connection = GetDBConnection();
        }

        public async Task<long> Save(WhatsappShortUrl ShortUrl)
        {
            string storeProcCommand = "select whatsappshorturl_details_save(@AccountId, @URLId, @WhatsappSendingSettingId, @WorkflowId,@triggersmsdripsid @CampaignType, @P5WhatsappUniqueID)";
            object? param = new { ShortUrl.AccountId, ShortUrl.URLId, ShortUrl.WhatsappSendingSettingId, ShortUrl.WorkflowId, triggersmsdripsid = 0, ShortUrl.CampaignType, ShortUrl.P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        public async Task<WhatsappShortUrl?> GetDetailsAsync(long SmsShortUrlId)
        {
            string storeProcCommand = "select * from whatsappshorturl_details_getdetails(@SmsShortUrlId)";
            object? param = new { SmsShortUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsappShortUrl>(storeProcCommand, param);
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
