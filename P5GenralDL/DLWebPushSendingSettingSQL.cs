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
    public class DLWebPushSendingSettingSQL : CommonDataBaseInteraction, IDLWebPushSendingSetting
    {
        CommonInfo connection = null;
        public DLWebPushSendingSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushSendingSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(WebPushSendingSetting webPushSendingSetting)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "Save", webPushSendingSetting.UserInfoUserId, webPushSendingSetting.UserGroupId, webPushSendingSetting.Name, webPushSendingSetting.WebPushTemplateId, webPushSendingSetting.GroupId, webPushSendingSetting.TotalSent, webPushSendingSetting.TotalClick, webPushSendingSetting.TotalView, webPushSendingSetting.TotalClose, webPushSendingSetting.TotalUnsubscribed, webPushSendingSetting.ScheduledDate, webPushSendingSetting.TotalNotSent, webPushSendingSetting.ScheduledStatus, webPushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(WebPushSendingSetting webPushSendingSetting)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "Update", webPushSendingSetting.Id, webPushSendingSetting.UserInfoUserId, webPushSendingSetting.Name, webPushSendingSetting.WebPushTemplateId, webPushSendingSetting.GroupId, webPushSendingSetting.ScheduledDate, webPushSendingSetting.ScheduledStatus, webPushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<WebPushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "GetList", OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<WebPushSendingSetting?> GetDetail(int Id)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "GET", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "MaxCount", FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateSentCount(int Id, int TotalSentCount, int TotalNotSentCount)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "UpdateSentCount", Id, TotalSentCount, TotalNotSentCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateSentCountAndNotSentCount(int Id, int TotalNotSentCount)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "UpdateSentCountAndNotSentCount", Id, TotalNotSentCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "CheckIdentifier", IdentifierName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateStoppedErrorStatus(WebPushSendingSetting webpushSendingSetting)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "UpdateStoppedErrorStatus", webpushSendingSetting.Id, webpushSendingSetting.StoppedReason, webpushSendingSetting.ScheduledStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForInterval()
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "GetRecentWebPushCampaignsForInterval" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForDailyOnce(int DaysLimit)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "GetRecentWebPushCampaignsForDailyOnce", DaysLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task UpdateWebPushCampaignSendStatus(int WebPushSendingSettingId)
        {
            const string storeProcCommand = "WebPush_SendingSetting";
            object? param = new { Action = "UpdateWebPushCampaignSendStatus", WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
