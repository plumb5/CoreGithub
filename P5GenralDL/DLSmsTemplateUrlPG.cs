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
    public class DLSmsTemplateUrlPG : CommonDataBaseInteraction, IDLSmsTemplateUrl
    {
        CommonInfo connection;
        public DLSmsTemplateUrlPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsTemplateUrlPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveSmsTemplateUrl(SmsTemplateUrl smsTemplateUrls)
        {
            string storeProcCommand = "select * from sms_templateurl_save(@SmsTemplateId,@UrlContent)";
            object? param = new { smsTemplateUrls.SmsTemplateId, smsTemplateUrls.UrlContent};
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  Update(SmsTemplateUrl smsTemplateUrls)
        {
            string storeProcCommand = "select * from sms_templateurl_update(@Id,@SmsTemplateId,@UrlContent)";
            object? param = new { smsTemplateUrls.Id, smsTemplateUrls.SmsTemplateId, smsTemplateUrls.UrlContent };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<SmsTemplateUrl>>  GetDetail(int SmsTemplateId)
        {
            string storeProcCommand = "select * from sms_templateurl_getdetailsbytemplateid(@SmsTemplateId)";
            object? param = new { SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplateUrl>(storeProcCommand, param);
        }

        public async Task<IEnumerable<string>> GetUrl(int smsTemplateUrlId)
        {
            string storeProcCommand = "select * from sms_templateurl_gettemplateurlbyid(@smsTemplateUrlId)";
            object? param = new { smsTemplateUrlId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<string>(storeProcCommand, param);
        }

        public async Task<bool> Delete(SmsTemplateUrl TemplateUrls)
        {
            string storeProcCommand = "select * from sms_templateurl_delete(@Id,@SmsTemplateId)";
            object? param = new { TemplateUrls.Id, TemplateUrls.SmsTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<IEnumerable<string>> GetUrlAsync(int smsTemplateUrlId)
        {
            string storeProcCommand = "select * from sms_templateurl_gettemplateurlbyid(@smsTemplateUrlId)";
            object? param = new { smsTemplateUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<string>(storeProcCommand, param);
        }

        public async Task<SmsTemplateUrl?> GetDetailByUrl(string Url)
        {
            int Id = 0;
            string smstemplateid = null;
            int offset = 0;
            int fetchnext = 0;
            string storeProcCommand = "selec * from sms_templateurl_get(@Id,@Url,@smstemplateid,@offset,@fetchnext)";
            object? param = new { Id, Url, smstemplateid, offset, fetchnext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplateUrl?>(storeProcCommand, param);
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
