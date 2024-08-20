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
    public class DLGoogleTokenPG : CommonDataBaseInteraction, IDLGoogleToken
    {
        CommonInfo connection = null;
        public DLGoogleTokenPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGoogleTokenPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(GoogleToken google)
        {
            string storeProcCommand = "select google_token_save(@AccessToken,@RefreshToken)";
            object? param = new { google.AccessToken, google.RefreshToken };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<GoogleToken?> Get()
        {
            string storeProcCommand = "select * from google_token_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<GoogleToken?>(storeProcCommand);
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
