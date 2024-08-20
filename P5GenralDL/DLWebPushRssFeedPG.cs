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
    public class DLWebPushRssFeedPG : CommonDataBaseInteraction, IDLWebPushRssFeed
    {
        private CommonInfo connection;
        public DLWebPushRssFeedPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushRssFeedPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WebPushRssFeed webPushRssFeed)
        {
            const string storeProcCommand = "select * from webpush_rssfeed_save(@UserInfoUserId, @CampaignId, @CampaignName, @RssUrl, @GroupId, @CheckRssFeedEvery, @IsAdvancedOptions, @IsAutoHide, @IsAndroidBadgeDefaultOrCustom, @ImageUrl, @UploadedIconFileName, @UploadedIconUrl, @Status)";
            object? param = new { webPushRssFeed.UserInfoUserId, webPushRssFeed.CampaignId, webPushRssFeed.CampaignName, webPushRssFeed.RssUrl, webPushRssFeed.GroupId, webPushRssFeed.CheckRssFeedEvery, webPushRssFeed.IsAdvancedOptions, webPushRssFeed.IsAutoHide, webPushRssFeed.IsAndroidBadgeDefaultOrCustom, webPushRssFeed.ImageUrl, webPushRssFeed.UploadedIconFileName, webPushRssFeed.UploadedIconUrl, webPushRssFeed.Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(WebPushRssFeed webPushRssFeed)
        {
            const string storeProcCommand = "select * from webpush_rssfeed_update(@Id, @UserInfoUserId, @CampaignId, @CampaignName, @RssUrl, @GroupId, @CheckRssFeedEvery, @IsAdvancedOptions, @IsAutoHide, @IsAndroidBadgeDefaultOrCustom, @ImageUrl, @UploadedIconFileName, @UploadedIconUrl, @Status)";
            object? param = new { webPushRssFeed.Id, webPushRssFeed.UserInfoUserId, webPushRssFeed.CampaignId, webPushRssFeed.CampaignName, webPushRssFeed.RssUrl, webPushRssFeed.GroupId, webPushRssFeed.CheckRssFeedEvery, webPushRssFeed.IsAdvancedOptions, webPushRssFeed.IsAutoHide, webPushRssFeed.IsAndroidBadgeDefaultOrCustom, webPushRssFeed.ImageUrl, webPushRssFeed.UploadedIconFileName, webPushRssFeed.UploadedIconUrl, webPushRssFeed.Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> MaxCount(DateTime FromDate, DateTime ToDate, string CampaignName = null)
        {
            string storeProcCommand = "select * from webpush_rssfeed_maxcount(@CampaignName, @FromDate, @ToDate)";
            object? param = new { CampaignName, FromDate, ToDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<WebPushRssFeed>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string CampaignName = null)
        {
            string storeProcCommand = "select * from webpush_rssfeed_getlist(@CampaignName, @FromDate, @ToDate, @OffSet, @FetchNext)";
            object? param = new { CampaignName, FromDate, ToDate, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushRssFeed>(storeProcCommand, param)).ToList();
        }

        public async Task<WebPushRssFeed?> GeDetails(WebPushRssFeed webPushRssFeed)
        {
            const string storeProcCommand = "select * from webpush_rssfeed_gedetails(@Id)";
            object? param = new { webPushRssFeed.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushRssFeed>(storeProcCommand, param);
        }


        public async Task<List<WebPushRssFeed>> GetFeedList()
        {
            string storeProcCommand = "select * from webpush_rssfeed_getfeedlist()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushRssFeed>(storeProcCommand)).ToList();
        }

        public async Task<bool> UpdatePublishedDate(WebPushRssFeed webPushRssFeed)
        {
            string storeProcCommand = "select * from webpush_rssfeed_updatepublisheddate(@Id, @RssFeedPublishedDate, @Title, @Description, @RedirectTo)";
            object? param = new { webPushRssFeed.Id, webPushRssFeed.RssFeedPublishedDate, webPushRssFeed.Title, webPushRssFeed.Description, webPushRssFeed.RedirectTo };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateDate(int Id)
        {
            string storeProcCommand = "select * from webpush_rssfeed_updatedate(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ChangeStatus(int Id, bool Status)
        {
            string storeProcCommand = "select * from webpush_rssfeed_changestatus(@Id, @Status)";
            object? param = new { Id, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from webpush_rssfeed_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
