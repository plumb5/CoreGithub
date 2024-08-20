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
    public class DLLicensingPG : CommonDataBaseInteraction, IDLLicensing
    {
        CommonInfo connection;
        public DLLicensingPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> Save(Licensing licensing)
        {
            string storeProcCommand = "select licensing_details_save(@LicensingKey)";
            object? param = new { licensing.LicensingKey };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<Licensing?> GetActiveKey()
        {
            string storeProcCommand = "select * from licensing_details_getactivekey()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Licensing?>(storeProcCommand);
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
