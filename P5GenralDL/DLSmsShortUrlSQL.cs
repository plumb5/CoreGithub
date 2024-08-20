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
    public class DLSmsShortUrlSQL : CommonDataBaseInteraction, IDLSmsShortUrl
    {
        CommonInfo connection;
        public DLSmsShortUrlSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<long> Save(SmsShortUrl ShortUrl)
        {
            string storeProcCommand = "SmsShortUrl_Details";
            object? param = new { Action= "Save", ShortUrl.AccountId, ShortUrl.URLId, ShortUrl.SMSSendingSettingId, ShortUrl.WorkflowId, ShortUrl.TriggerSMSDripsId, ShortUrl.CampaignType, ShortUrl.P5SMSUniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }

        public async Task<SmsShortUrl?> GetDetails(long SmsShortUrlId)
        {
            string storeProcCommand = "SmsShortUrl_Details";
            object? param = new { Action = "GetDetails", SmsShortUrlId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsShortUrl?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<SmsShortUrl>> GetDetailsAsync(long SmsShortUrlId)
        {
            string storeProcCommand = "SmsShortUrl_Details";
            object? param = new { Action = "GetDetails", SmsShortUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsShortUrl>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


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
