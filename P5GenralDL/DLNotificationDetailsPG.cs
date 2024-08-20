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
    public class DLNotificationDetailsPG : CommonDataBaseInteraction, IDLNotificationDetails
    {
        CommonInfo connection;
        public DLNotificationDetailsPG()
        {
            connection = GetDBConnection();
        }

        public DLNotificationDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLNotificationDetailsPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> SaveDetails(NotificationDetails notification)
        {
            string storeProcCommand = "select notification_details_save(@Name, @Account, @AccountAccountId, @UserInfoUserId, @Title, @Updates, @FeatureType, @ActiveStatus, @ShowonUrl, @Fromdate, @Todate)";
            object? param = new { notification.Name, notification.Account, notification.AccountAccountId, notification.UserInfoUserId, notification.Title, notification.Updates, notification.FeatureType, notification.ActiveStatus, notification.ShowonUrl, notification.Fromdate, notification.Todate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<Int32> SaveCallDetails(MLNotificationDetails notification)
        {
            string storeProcCommand = "select notification_details_save(@UserInfoUserId, @ContactId, @Heading, @Details, @PageUrl, @IsThatSeen)";
            object? param = new { notification.UserInfoUserId, notification.ContactId, notification.Heading, notification.Details, notification.PageUrl, notification.IsThatSeen };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<NotificationDetails>> GetDetails(int UserInfoUserId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from notification_details_getdetails(@UserInfoUserId, @OffSet,@FetchNext)";
            object? param = new { UserInfoUserId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<NotificationDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<NotificationDetails?> GetDetails(Int32 Id)
        {
            string storeProcCommand = "select * from notification_details_get(Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<NotificationDetails?>(storeProcCommand, param);
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
