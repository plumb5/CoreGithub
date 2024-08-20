using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using Newtonsoft.Json;

namespace P5GenralDL
{
    public class DLNotificationsPG : CommonDataBaseInteraction, IDLNotifications
    {
        CommonInfo connection = null;
        public DLNotificationsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLNotificationsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<long> Save(Notifications notifications)
        {
            string storeProcCommand = "select notification_details_save(@UserInfoUserId, @ContactId, @Heading, @Details, @PageUrl, @IsThatSeen)";
            object? param = new { notifications.UserInfoUserId, notifications.ContactId, notifications.Heading, notifications.Details, notifications.PageUrl, notifications.IsThatSeen };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        public async Task<bool> Update(Notifications notifications)
        {
            string storeProcCommand = "select notification_details_update(@Id, @UserInfoUserId, @ContactId, @Heading, @Details, @PageUrl, @IsThatSeen)";
            object? param = new { notifications.Id, notifications.UserInfoUserId, notifications.ContactId, notifications.Heading, notifications.Details, notifications.PageUrl, notifications.IsThatSeen };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetNotificationCount(int UserInfoUserId)
        {
            string storeProcCommand = "select * from notification_details_getnotificationcount(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<Notifications>> GetNotifications(int UserInfoUserId)
        {
            string storeProcCommand = "select * from notification_details_getnotifications(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Notifications>(storeProcCommand, param)).ToList();
        }

        public async Task<Notifications?> GetNotificationsByUserId(int UserInfoUserId, int ContactId, string PageUrl)
        {
            string storeProcCommand = "select * from notification_details_getnotificationsbyuserid(@UserInfoUserId,@ContactId,@PageUrl)";
            object? param = new { UserInfoUserId, ContactId, PageUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Notifications?>(storeProcCommand, param);
        }

        public async Task<bool> UpdateSeenStatus(Notifications notifications)
        {
            string storeProcCommand = "select notification_details_updateseenstatus(@Id, @UserInfoUserId, @IsThatSeen)";
            object? param = new { notifications.Id, notifications.UserInfoUserId, notifications.IsThatSeen };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
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

