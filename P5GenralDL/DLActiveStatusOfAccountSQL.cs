using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLActiveStatusOfAccountSQL : CommonDataBaseInteraction, IDLActiveStatusOfAccount
    {
        CommonInfo connection;
        public DLActiveStatusOfAccountSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLActiveStatusOfAccountSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<ActiveStatusOfAccount?> GetActiveStatus()
        {
            string storeProcCommand = "ActiveStatus_ForAccount";
            object? param = new { Action = "CheckingActiveStatusOfAccount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ActiveStatusOfAccount?>(storeProcCommand, param,commandType: CommandType.StoredProcedure);
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
