﻿using Dapper;
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
    public class DLWebHookTrackerSQL : CommonDataBaseInteraction, IDLWebHookTracker
    {
        CommonInfo connection;
        public DLWebHookTrackerSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebHookTrackerSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Save(WebHookTracker webHookTracker)
        {
            string storeProcCommand = "WebHookTracker_Details";
            object? param = new { Action = "Save", webHookTracker.PostedUrl, webHookTracker.Response, webHookTracker.ResponseCode, webHookTracker.ResponseFromServer, webHookTracker.CallingSource, webHookTracker.RequestBody, webHookTracker.FormorChatId, webHookTracker.WebHookId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<List<WebHookTracker>> GetList(WebHookTracker webHookTracker, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "WebHookTracker_Details";
            object? param = new { Action = "GetList", webHookTracker.Response, webHookTracker.ResponseCode, webHookTracker.ResponseFromServer, webHookTracker.PostedUrl, webHookTracker.CallingSource, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebHookTracker>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> GetMaxCount(WebHookTracker webHookTracker, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "WebHookTracker_Details";
            object? param = new { Action = "GetMaxCount", webHookTracker.Response, webHookTracker.ResponseCode, webHookTracker.ResponseFromServer, webHookTracker.PostedUrl, webHookTracker.CallingSource, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
