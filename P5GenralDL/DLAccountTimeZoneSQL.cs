using Dapper;
using DBInteraction;
using IP5GenralDL;
using Microsoft.Identity.Client;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAccountTimeZoneSQL : CommonDataBaseInteraction, IDLAccountTimeZone
    {
        CommonInfo connection = null;
        public DLAccountTimeZoneSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLAccountTimeZoneSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<AccountTimeZone?> GET()
        {
            string storeProcCommand = "Account_TimeZone";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<AccountTimeZone?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        public async Task<Int32> Save(string TimeZone, int AccountID = 0, string? TimeZoneTitle = null)
        {
            string storeProcCommand = "Account_TimeZone";
            object? param = new { TimeZone };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
