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
    public class DLSmsTemplateUrlSQL : CommonDataBaseInteraction, IDLSmsTemplateUrl
    {
        CommonInfo connection;
        public DLSmsTemplateUrlSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsTemplateUrlSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveSmsTemplateUrl(SmsTemplateUrl smsTemplateUrls)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action= "Save", smsTemplateUrls.UrlContent, smsTemplateUrls.SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(SmsTemplateUrl smsTemplateUrls)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "Update", smsTemplateUrls.Id, smsTemplateUrls.UrlContent, smsTemplateUrls.SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<SmsTemplateUrl>> GetDetail(int SmsTemplateId)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "GetDetailsByTemplateId", SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplateUrl>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<string>> GetUrl(int smsTemplateUrlId)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "GetTemplateUrlById", smsTemplateUrlId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<string>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(SmsTemplateUrl TemplateUrls)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "Delete", TemplateUrls.Id, TemplateUrls.SmsTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<string>> GetUrlAsync(int smsTemplateUrlId)
        {
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "GetTemplateUrlById", smsTemplateUrlId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<string>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsTemplateUrl?> GetDetailByUrl(string Url)
        { 
            string storeProcCommand = "Sms_TemplateUrl";
            object? param = new { Action = "GET", Url  };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplateUrl?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
