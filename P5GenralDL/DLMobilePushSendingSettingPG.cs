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
    public class DLMobilePushSendingSettingPG : CommonDataBaseInteraction, IDLMobilePushSendingSetting
    {

        CommonInfo connection = null;
        public DLMobilePushSendingSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSendingSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<Int32> Save(MobilePushSendingSetting mobilePushSendingSetting)
        {
            string storeProcCommand = "select mobilepush_sendingsetting_save(@UserInfoUserId, @UserGroupId, @Name, @MobilePushTemplateId, @GroupId, @TotalSent, @TotalClick, @TotalView, @TotalClose, @TotalUnsubscribed, @ScheduledDate, @TotalNotSent, @ScheduledStatus, @CampaignId)";
            object? param = new { mobilePushSendingSetting.UserInfoUserId, mobilePushSendingSetting.UserGroupId, mobilePushSendingSetting.Name, mobilePushSendingSetting.MobilePushTemplateId, mobilePushSendingSetting.GroupId, mobilePushSendingSetting.TotalSent, mobilePushSendingSetting.TotalClick, mobilePushSendingSetting.TotalView, mobilePushSendingSetting.TotalClose, mobilePushSendingSetting.TotalUnsubscribed, mobilePushSendingSetting.ScheduledDate, mobilePushSendingSetting.TotalNotSent, mobilePushSendingSetting.ScheduledStatus, mobilePushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(MobilePushSendingSetting mobilePushSendingSetting)
        {
            string storeProcCommand = "select mobilepush_sendingsetting_update(@Id, @UserInfoUserId, @Name, @MobilePushTemplateId, @GroupId, @ScheduledDate, @ScheduledStatus, @CampaignId)";
            object? param = new { mobilePushSendingSetting.Id, mobilePushSendingSetting.UserInfoUserId, mobilePushSendingSetting.Name, mobilePushSendingSetting.MobilePushTemplateId, mobilePushSendingSetting.GroupId, mobilePushSendingSetting.ScheduledDate, mobilePushSendingSetting.ScheduledStatus, mobilePushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "select mobilepush_sendingsetting_maxcount(@FromDate, @ToDate, @Name)";
            object? param = new { FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<MobilePushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "select * from mobilepush_sendingsetting_getlist(@OffSet, @FetchNext, @FromDate, @ToDate, @Name)";
            object? param = new { OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task<MobilePushSendingSetting?> GetDetail(int Id)
        {
            string storeProcCommand = "select * from mobilepush_sendingsetting_get(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushSendingSetting?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mobilepush_sendingsetting_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            string storeProcCommand = "select mobilepush_sendingsetting_checkidentifier()";
            object? param = new { IdentifierName };

            using var db = GetDbConnection(connection.Connection);
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
