using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Identity.Client;

namespace P5GenralDL
{
    public class DLAccountConnectionSQL : CommonDataBaseInteraction, IDLAccountConnection
    {
        CommonInfo connection;
        public DLAccountConnectionSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<CommonInfo?> GetAccountConnection(int AccountId)
        {
            string storeProcCommand = "Account_Connections";
            object? param = new { Action = "GetConnectionSting", AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CommonInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetAllAccountConnection()
        {
            string storeProcCommand = "Account_Connections";
            object? param = new { Action = "AllConnections" };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
