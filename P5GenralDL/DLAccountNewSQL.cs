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

namespace P5GenralDL
{
    public class DLAccountNewSQL : CommonDataBaseInteraction, IDLAccountNew
    {
        CommonInfo connection;
        public DLAccountNewSQL()
        {
            connection = GetDBConnection();
        }

        public DLAccountNewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetConnectionstrng(int UserId, string connectionForLeadsCnt)
        {
            try
            {
                if (!string.IsNullOrEmpty(connectionForLeadsCnt))
                    connection.Connection = connectionForLeadsCnt;

                var storeProcCommand = "GetLeadsCountForNotification";
                object? param = new { UserId };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> GetIncludeExcludedInfo(_Plumb5IncludeExclude mLAccount)
        {
            try
            {
                var storeProcCommand = "InsertIncludeExclude";
                object? param = new { Key = "Get", mLAccount.AccountId };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryFirstOrDefaultAsync<object?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> GetNotification(int UserId)
        {
            try
            {
                var storeProcCommand = "SelectAccountDetails";
                object? param = new { UserId, Key = "GetNotifications" };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryFirstOrDefaultAsync<object?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<int> SaveIncludeExclude(_Plumb5IncludeExclude mLAccount)
        {
            try
            {
                var storeProcCommand = "InsertIncludeExclude";
                object? param = new { mLAccount.AccountId, mLAccount.AllowSubDomain, mLAccount.IncludeKey, mLAccount.ExcludeKey };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<DataSet> SelectApikey(int UserId)
        {
            string storeProcCommand = "GetApiKey";
            object? param = new { Action = "SelectApikey", UserId };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<long> UpdateApikey(int UserId, string Apikey)
        {
            string storeProcCommand = "GetApiKey";
            object? param = new { Action = "UpdateApiKey", UserId, Apikey };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
