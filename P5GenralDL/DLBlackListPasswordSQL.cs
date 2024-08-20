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
    public class DLBlackListPasswordSQL : CommonDataBaseInteraction, IDLBlackListPassword
    {
        CommonInfo connection;
        public DLBlackListPasswordSQL()
        {
            connection = GetDBConnection();
        }
        public async Task<List<BlackListPassword>> GetBlackListNameExists()
        {
            string storeProcCommand = "BlackListPassowrd_Info";
            object? param = new { Action = "GetBlackListNames" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<BlackListPassword>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
