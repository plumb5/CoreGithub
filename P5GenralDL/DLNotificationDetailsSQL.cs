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
    public class DLNotificationDetailsSQL : CommonDataBaseInteraction, IDLNotificationDetails
    {
        CommonInfo connection;
        public DLNotificationDetailsSQL()
        {
            connection = GetDBConnection();
        }

        public DLNotificationDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLNotificationDetailsSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> SaveDetails(NotificationDetails notification)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { Action = "Save", notification.Name, notification.Account, notification.AccountAccountId, notification.UserInfoUserId, notification.Title, notification.Updates, notification.FeatureType, notification.ActiveStatus, notification.ShowonUrl, notification.Fromdate, notification.Todate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> SaveCallDetails(MLNotificationDetails notification)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { Action = "Update", notification.UserInfoUserId, notification.ContactId, notification.Heading, notification.Details, notification.PageUrl, notification.IsThatSeen };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<NotificationDetails>> GetDetails(int UserInfoUserId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { Action = "GET", UserInfoUserId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<NotificationDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<NotificationDetails?> GetDetails(Int32 Id)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { Action = "GET", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<NotificationDetails?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
