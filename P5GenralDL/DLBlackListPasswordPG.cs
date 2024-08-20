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
    public class DLBlackListPasswordPG : CommonDataBaseInteraction, IDLBlackListPassword
    {
        CommonInfo connection;
        public DLBlackListPasswordPG()
        {
            connection = GetDBConnection();
        }
        public async Task<List<BlackListPassword>>  GetBlackListNameExists()
        {
            string storeProcCommand = "select * from blacklistpassowrd_info_getblacklistnames()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<BlackListPassword>(storeProcCommand)).ToList();

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
