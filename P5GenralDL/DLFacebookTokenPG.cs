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
    public class DLFacebookTokenPG : CommonDataBaseInteraction, IDLFacebookToken
    {
        CommonInfo connection = null;
        public DLFacebookTokenPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFacebookTokenPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(FacebookToken fbToken)
        {
            string storeProcCommand = "select facebook_token_save(@Token)";
            object? param = new { fbToken.Token };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<FacebookToken?> Get()
        {
            string storeProcCommand = "select * from facebook_token_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FacebookToken?>(storeProcCommand);
        }

        public async Task<bool> DeleteToken()
        {
            string storeProcCommand = "select facebook_token_delete()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand) > 0;
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
