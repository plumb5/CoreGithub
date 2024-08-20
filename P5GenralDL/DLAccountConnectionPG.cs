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
    public class DLAccountConnectionPG : CommonDataBaseInteraction, IDLAccountConnection
    {
        CommonInfo connection;
        public DLAccountConnectionPG()
        {
            connection = GetDBConnection();
        }

        public async Task<CommonInfo?> GetAccountConnection(int AccountId)
        {
            string storeProcCommand = "select * from getaccount_getconnectionsting(@AccountId)";            
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CommonInfo?>(storeProcCommand, param);
        }

        public async Task<DataSet> GetAllAccountConnection()
        {
            string storeProcCommand = "select * from account_connections_allconnections()";

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
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
