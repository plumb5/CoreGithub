﻿using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;

namespace P5GenralDL
{
    public class DLAnlyticsNotificationLogSQL : CommonDataBaseInteraction, IDLAnlyticsNotificationLog
    {
        CommonInfo connection;
        public DLAnlyticsNotificationLogSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> Save(AnlyticsNotificationLog log)
        {
            string storeProcCommand = "Anlytics_NotificationLog";
            object? param = new { Action = "Save", log.Accountid, log.LastSentDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(AnlyticsNotificationLog log)
        {
            string storeProcCommand = "Anlytics_NotificationLog";
            object? param = new { Action = "Update", log.Accountid, log.LastSentDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<IEnumerable<AnlyticsNotificationLog>> GetDetails(int Accountid)
        {
            string storeProcCommand = "Anlytics_NotificationLog";
            object? param = new { Action = "GET", Accountid };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<AnlyticsNotificationLog>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
