using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWhatsAppLanguageCodesSQL : CommonDataBaseInteraction, IDLWhatsAppLanguageCodes
    {
        CommonInfo connection;
        public DLWhatsAppLanguageCodesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppLanguageCodesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<WhatsAppLanguageCodes?> GetWhatsAppShortenLanguageCode(string VendorName, string TemplateLanguage)
        {
            string storeProcCommand = "WhatsApp_LanguageCodes";
            object? param = new { Action = "GetShortenLanguageCode", VendorName, TemplateLanguage };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppLanguageCodes>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

           
        }
        #region Dispose Method

        bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged resources
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
