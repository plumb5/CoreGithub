using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;


namespace P5GenralDL
{
    public class DLNotificationsSQL : CommonDataBaseInteraction, IDLNotifications
    {
        CommonInfo connection = null;
        public DLNotificationsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLNotificationsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<long> Save(Notifications notifications)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "Save", notifications.UserInfoUserId, notifications.ContactId, notifications.Heading, notifications.Details, notifications.PageUrl, notifications.IsThatSeen };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(Notifications notifications)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "Update", notifications.Id, notifications.UserInfoUserId, notifications.ContactId, notifications.Heading, notifications.Details, notifications.PageUrl, notifications.IsThatSeen };

            using var db = GetDbConnection();
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetNotificationCount(int UserInfoUserId)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "GetNotificationCount", UserInfoUserId };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<Notifications>> GetNotifications(int UserInfoUserId)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "GetNotifications", UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Notifications>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Notifications?> GetNotificationsByUserId(int UserInfoUserId, int ContactId, string PageUrl)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "GetNotificationsByUserId", UserInfoUserId, ContactId, PageUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Notifications?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateSeenStatus(Notifications notifications)
        {
            string storeProcCommand = "Notification_Details";
            object? param = new { @Action = "UpdateSeenStatus", notifications.Id, notifications.UserInfoUserId, notifications.IsThatSeen };

            using var db = GetDbConnection();
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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


