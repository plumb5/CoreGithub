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
    public class DLWebHookDetailsPG : CommonDataBaseInteraction, IDLWebHookDetails
    {
        CommonInfo connection;
        public DLWebHookDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebHookDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WebHookDetails webHookDetails)
        {
            string storeProcCommand = "select * from webhook_details_save(@RequestURL, @MethodType, @ContentType, @FieldMappingDetails, @Headers, @BasicAuthentication, @RawBody)";
            object? param = new { webHookDetails.RequestURL, webHookDetails.MethodType, webHookDetails.ContentType, webHookDetails.FieldMappingDetails, webHookDetails.Headers, webHookDetails.BasicAuthentication, webHookDetails.RawBody };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(WebHookDetails webHookDetails)
        {
            string storeProcCommand = "select * from webhook_details_update(@WebHookId, @RequestURL, @MethodType, @ContentType, @FieldMappingDetails, @Headers, @BasicAuthentication, @RawBody)";
            object? param = new { webHookDetails.WebHookId, webHookDetails.RequestURL, webHookDetails.MethodType, webHookDetails.ContentType, webHookDetails.FieldMappingDetails, webHookDetails.Headers, webHookDetails.BasicAuthentication, webHookDetails.RawBody };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<WebHookDetails?> GetWebHookDetails(int WebHookId)
        {
            string storeProcCommand = "select * from webhook_details_getwebhookdetails(@WebHookId)";
            object? param = new { WebHookId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebHookDetails?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int WebHookId)
        {
            string storeProcCommand = "select * from webhook_details_delete(@WebHookId)";
            object? param = new { WebHookId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
