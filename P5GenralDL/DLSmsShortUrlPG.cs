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
    internal class DLSmsShortUrlPG : CommonDataBaseInteraction, IDLSmsShortUrl
    {
        CommonInfo connection;
        public DLSmsShortUrlPG()
        {
            connection = GetDBConnection();
        }

        public async Task<long> Save(SmsShortUrl ShortUrl)
        {
            string storeProcCommand = "select smsshorturl_details_save(@AccountId, @URLId, @SMSSendingSettingId, @WorkflowId, @TriggerSMSDripsId, @CampaignType, @P5SMSUniqueID)";
            object? param = new { ShortUrl.AccountId, ShortUrl.URLId, ShortUrl.SMSSendingSettingId, ShortUrl.WorkflowId, ShortUrl.TriggerSMSDripsId, ShortUrl.CampaignType, ShortUrl.P5SMSUniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        public async Task<SmsShortUrl?> GetDetails(long SmsShortUrlId)
        {
            string storeProcCommand = "select * from smsshorturl_details_getdetails(@SmsShortUrlId)";
            object? param = new { SmsShortUrlId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsShortUrl?>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsShortUrl>> GetDetailsAsync(long SmsShortUrlId)
        {
            string storeProcCommand = "select * from smsshorturl_details_getdetails(@SmsShortUrlId)";
            object? param = new { SmsShortUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsShortUrl>(storeProcCommand, param);

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
