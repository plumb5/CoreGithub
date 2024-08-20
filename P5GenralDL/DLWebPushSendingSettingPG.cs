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
    public class DLWebPushSendingSettingPG : CommonDataBaseInteraction, IDLWebPushSendingSetting
    {
        CommonInfo connection = null;
        public DLWebPushSendingSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushSendingSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(WebPushSendingSetting webPushSendingSetting)
        {
            try
            {
                const string storeProcCommand = "select * from webpush_sendingsetting_save(@UserInfoUserId, @UserGroupId, @Name, @WebPushTemplateId, @GroupId, @TotalSent, @TotalClick, @TotalView, @TotalClose, @TotalUnsubscribed, @ScheduledDate, @TotalNotSent, @ScheduledStatus, @CampaignId)";
                object? param = new { webPushSendingSetting.UserInfoUserId, webPushSendingSetting.UserGroupId, webPushSendingSetting.Name, webPushSendingSetting.WebPushTemplateId, webPushSendingSetting.GroupId, webPushSendingSetting.TotalSent, webPushSendingSetting.TotalClick, webPushSendingSetting.TotalView, webPushSendingSetting.TotalClose, webPushSendingSetting.TotalUnsubscribed, webPushSendingSetting.ScheduledDate, webPushSendingSetting.TotalNotSent, webPushSendingSetting.ScheduledStatus, webPushSendingSetting.CampaignId };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        public async Task<bool> Update(WebPushSendingSetting webPushSendingSetting)
        {
            const string storeProcCommand = "select * from webpush_sendingsetting_update(@Id, @UserInfoUserId, @Name, @WebPushTemplateId, @GroupId, @ScheduledDate, @ScheduledStatus, @CampaignId)";
            object? param = new { webPushSendingSetting.Id, webPushSendingSetting.UserInfoUserId, webPushSendingSetting.Name, webPushSendingSetting.WebPushTemplateId, webPushSendingSetting.GroupId, webPushSendingSetting.ScheduledDate, webPushSendingSetting.ScheduledStatus, webPushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<WebPushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null)
        {
            const string storeProcCommand = "select * from webpush_sendingsetting_getlist(@OffSet, @FetchNext, @FromDate, @ToDate, @Name)";
            object? param = new { OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task<WebPushSendingSetting?> GetDetail(int Id)
        {
            const string storeProcCommand = "select * from webpush_sendingsetting_get(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSendingSetting>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            const string storeProcCommand = "select webpush_sendingsetting_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            const string storeProcCommand = "select webpush_sendingsetting_maxcount(@FromDate, @ToDate, @Name)";
            object? param = new { FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> UpdateSentCount(int Id, int TotalSentCount, int TotalNotSentCount)
        {
            const string storeProcCommand = "select webpush_sendingsetting_updatesentcount(@Id, @TotalSentCount, @TotalNotSentCount)";
            object? param = new { Id, TotalSentCount, TotalNotSentCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateSentCountAndNotSentCount(int Id, int TotalNotSentCount)
        {
            const string storeProcCommand = "select webpush_sendingsetting_updatesentcountandnotsentcount(@Id, @TotalNotSentCount)";
            object? param = new { Id, TotalNotSentCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            const string storeProcCommand = "select webpush_sendingsetting_checkidentifier(@IdentifierName)";
            object? param = new { IdentifierName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateStoppedErrorStatus(WebPushSendingSetting webpushSendingSetting)
        {
            const string storeProcCommand = "select webpush_sendingsetting_updatestoppederrorstatus(@Id, @StoppedReason, @ScheduledStatus)";
            object? param = new { webpushSendingSetting.Id, webpushSendingSetting.StoppedReason, webpushSendingSetting.ScheduledStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForInterval()
        {
            const string storeProcCommand = "select * from webpush_sendingsetting_getrecentwebpushcampaignsforinterval()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand)).ToList();
        }

        public async Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForDailyOnce(int DaysLimit)
        {
            const string storeProcCommand = "select webpush_sendingsetting_getrecentwebpushcampaignsfordailyonce(@DaysLimit)";
            object? param = new { DaysLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task UpdateWebPushCampaignSendStatus(int WebPushSendingSettingId)
        {
            const string storeProcCommand = "select webpush_sendingsetting_updatewebpushcampaignsendstatus(@WebPushSendingSettingId)";
            object? param = new { WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
                    connection = null;
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
