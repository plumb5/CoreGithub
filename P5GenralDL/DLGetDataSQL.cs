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
    public class DLGetDataSQL : CommonDataBaseInteraction, IDLGetData
    {
        CommonInfo connection = null;
        public DLGetDataSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGetDataSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<GetAccount>> GetDetails(DateTime dateFrom, DateTime dateTo)
        {
            string storeProcCommand = "select * from get_data(@dateFrom, @dateTo)";
            object? param = new { dateFrom, dateTo };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GetAccount>(storeProcCommand, param)).ToList();

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
