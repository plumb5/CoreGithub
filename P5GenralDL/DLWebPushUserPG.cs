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
    public class DLWebPushUserPG : CommonDataBaseInteraction, IDLWebPushUser
    {
        private CommonInfo connection;
        public DLWebPushUserPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLWebPushUserPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> GetMaxCount(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, string FilterByEmailorPhone)
        {
            try
            {
                const string storeProcCommand = "select * from webpush_user_getmaxcount(@MachineId, @FromDateTime, @ToDateTime, @IPAddress, @SubscribedURL,@GroupId, @FilterByEmailorPhone)";
                object? param = new { webPushUser.MachineId, FromDateTime, ToDateTime, webPushUser.IPAddress, webPushUser.SubscribedURL, GroupId=0, FilterByEmailorPhone };
                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return -1;
            }

        }

        public async Task<IEnumerable<WebPushUser>> GetDetails(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, int Offset, int FetchNext, string FilterByEmailorPhone)
        {
            const string storeProcCommand = "select * from webpush_user_getdetails(@MachineId,@FromDateTime, @ToDateTime, @IPAddress, @SubscribedURL,@GroupId, @FilterByEmailorPhone, @Offset, @FetchNext)"; 
            object? param = new { FromDateTime, ToDateTime, Offset, FetchNext, webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, GroupId = 0, FilterByEmailorPhone };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WebPushUser>(storeProcCommand, param);
        }

        public async Task<WebPushUser?>  GetWebPushInfo(WebPushUser objInfo)
        {
            string storeProcCommand = "select * from webpush_user_get(@MachineId)"; 
            object? param = new { objInfo.MachineId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushUser?>(storeProcCommand, param);
        }


        public async Task<Int32> GetGroupMaxCount(WebPushUser webPushUser, int GroupId)
        {
            const string storeProcCommand = "select webpush_user_getgroupmaxcount(@IPAddress, @MachineId, @SubscribedURL, @GroupId)";
            
            object? param = new { webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLWebPushUser>> GetGroupDetails(WebPushUser webPushUser, int Offset, int FetchNext, int GroupId)
        {
            const string storeProcCommand = "select * from webpush_user_getgroupdetails(@Offset, @FetchNext, @IPAddress, @MachineId, @SubscribedURL, @GroupId)"; 
            object? param = new { Offset, FetchNext, webPushUser.IPAddress, webPushUser.MachineId, webPushUser.SubscribedURL, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWebPushUser>(storeProcCommand, param);
        }

        public async Task<Int32> Save(WebPushUser webPushUserInfo)
        {
            string storeProcCommand = "select webpush_user_save(@MachineId, @ContactId,@FcmRegId, @IsSubscribe, @VapidEndPointUrl, @VapidTokenKey, @VapidAuthKey, @BrowserName, @SubscribedURL, @IsDesktopOrMobile, @IPAddress )"; 
            object? param = new  { webPushUserInfo.MachineId, webPushUserInfo.ContactId, webPushUserInfo.FCMRegId, webPushUserInfo.IsSubscribe, webPushUserInfo.VapidEndPointUrl, webPushUserInfo.VapidTokenKey, webPushUserInfo.VapidAuthKey, webPushUserInfo.BrowserName, webPushUserInfo.SubscribedURL, webPushUserInfo.IsDesktopOrMobile, webPushUserInfo.IPAddress };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
