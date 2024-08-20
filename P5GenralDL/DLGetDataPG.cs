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
    internal class DLGetDataPG : CommonDataBaseInteraction, IDLGetData
    {
        CommonInfo connection = null;
        public DLGetDataPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGetDataPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<GetAccount>> GetDetails(DateTime dateFrom, DateTime dateTo)
        {
            string storeProcCommand = "GetData";
            object? param = new { dateFrom, dateTo };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GetAccount>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
