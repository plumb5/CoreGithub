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
    public class DLWebPushUserSQL : CommonDataBaseInteraction, IDLWebPushUser
    {
        private CommonInfo connection;
        public DLWebPushUserSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLWebPushUserSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> GetMaxCount(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, string FilterByEmailorPhone)
        {
            const string storeProcCommand = "WebPush_User";
            object? param = new { Action= "GetMaxCount", webPushUser.MachineId, FromDateTime, ToDateTime, webPushUser.IPAddress, webPushUser.SubscribedURL, FilterByEmailorPhone };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<WebPushUser>> GetDetails(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, int Offset, int FetchNext, string FilterByEmailorPhone)
        {
            const string storeProcCommand = "WebPush_User";
            object? param = new { Action = "GetDetails",FromDateTime, ToDateTime, Offset, FetchNext, webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, FilterByEmailorPhone };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WebPushUser>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }

        public async Task<WebPushUser?> GetWebPushInfo(WebPushUser objInfo)
        {
            string storeProcCommand = "WebPush_User";
            object? param = new { Action = "GET", objInfo.MachineId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushUser?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<Int32> GetGroupMaxCount(WebPushUser webPushUser, int GroupId)
        {
            const string storeProcCommand = "WebPush_User";

            object? param = new { Action = "GetGroupMaxCount", webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLWebPushUser>> GetGroupDetails(WebPushUser webPushUser, int Offset, int FetchNext, int GroupId)
        {
            const string storeProcCommand = "WebPush_User";
            object? param = new { Action = "GetGroupDetails", Offset, FetchNext, webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, GroupId };
            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryAsync<MLWebPushUser>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> Save(WebPushUser webPushUserInfo)
        {
            string storeProcCommand = "WebPush_User";
            object? param = new { Action = "Save",webPushUserInfo.MachineId, webPushUserInfo.ContactId, webPushUserInfo.IsSubscribe, webPushUserInfo.VapidEndPointUrl, webPushUserInfo.VapidTokenKey, webPushUserInfo.VapidAuthKey, webPushUserInfo.BrowserName, webPushUserInfo.SubscribedURL, webPushUserInfo.IsDesktopOrMobile, webPushUserInfo.IPAddress };
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
