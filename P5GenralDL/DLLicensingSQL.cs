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
    public class DLLicensingSQL : CommonDataBaseInteraction, IDLLicensing
    {
        CommonInfo connection;
        public DLLicensingSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> Save(Licensing licensing)
        {
            string storeProcCommand = "Licensing_Details";
            object? param = new { Action = "Save", licensing.LicensingKey };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Licensing?> GetActiveKey()
        {
            string storeProcCommand = "Licensing_Details";
            object? param = new { Action = "GetActiveKey" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Licensing?>(storeProcCommand, commandType: CommandType.StoredProcedure);
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
