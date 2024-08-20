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
    public class DLActiveStatusOfAccountPG : CommonDataBaseInteraction, IDLActiveStatusOfAccount
    {
        CommonInfo connection;
        public DLActiveStatusOfAccountPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLActiveStatusOfAccountPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }        

        public async Task<ActiveStatusOfAccount?> GetActiveStatus()
        {
            string storeProcCommand = "select * from activestatus_foraccount()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ActiveStatusOfAccount?>(storeProcCommand);
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
