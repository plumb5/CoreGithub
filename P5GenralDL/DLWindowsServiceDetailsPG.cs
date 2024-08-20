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
    public class DLWindowsServiceDetailsPG : CommonDataBaseInteraction, IDLWindowsServiceDetails
    {
        CommonInfo connection;
        public DLWindowsServiceDetailsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<List<WindowsServiceDetails>> GetAllService()
        {
            string storeProcCommand = "select * from windowsservice_details_getallservice()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WindowsServiceDetails>(storeProcCommand)).ToList();
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
                    connection = null;
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
