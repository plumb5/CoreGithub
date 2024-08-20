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
    public class DLAccountTimeZonePG : CommonDataBaseInteraction,IDLAccountTimeZone
    {
        CommonInfo connection = null;
        public DLAccountTimeZonePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLAccountTimeZonePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<AccountTimeZone?> GET()
        {
            string storeProcCommand = "select * from account_timezone_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<AccountTimeZone?>(storeProcCommand);


        }

        public async Task<Int32> Save(string TimeZone, int AccountID = 0, string? TimeZoneTitle = null)
        {
            string storeProcCommand = "select account_timezone_save(@TimeZone)";
            object? param = new { TimeZone };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
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
