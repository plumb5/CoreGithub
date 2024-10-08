﻿using Dapper;
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
    public class DLAccountNewPG : CommonDataBaseInteraction, IDLAccountNew
    {
        CommonInfo connection;
        public DLAccountNewPG()
        {
            connection = GetDBConnection();
        }

        public DLAccountNewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetConnectionstrng(int UserId, string connectionForLeadsCnt)
        {
            try
            {
                if (!string.IsNullOrEmpty(connectionForLeadsCnt))
                    connection.Connection = connectionForLeadsCnt;

                var storeProcCommand = "select getleadscountfornotification(@UserId)";
                object? param = new { UserId };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
                var storeProcCommand = "select * from insertincludeexclude_get(@AccountId)";
                object? param = new { mLAccount.AccountId };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryFirstOrDefaultAsync<object?>(storeProcCommand, param);
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
                var storeProcCommand = "select * from selectaccountdetails_getnotifications(@UserId)";
                object? param = new { UserId };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryFirstOrDefaultAsync<object?>(storeProcCommand, param);
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
                var storeProcCommand = "select insertincludeexclude_set(@AccountId, @AllowSubDomain, @IncludeKey, @ExcludeKey)";
                object? param = new { mLAccount.AccountId, mLAccount.AllowSubDomain, mLAccount.IncludeKey, mLAccount.ExcludeKey };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<DataSet> SelectApikey(int UserId)
        {
            string storeProcCommand = "select * from getapikey_selectapikey(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<long> UpdateApikey(int UserId, string Apikey)
        {
            string storeProcCommand = "select * from getapikey_update(@UserId,@Apikey)";
            object? param = new { UserId, Apikey };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
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
