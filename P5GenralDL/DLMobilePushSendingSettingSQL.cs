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
    public class DLMobilePushSendingSettingSQL : CommonDataBaseInteraction, IDLMobilePushSendingSetting
    {

        CommonInfo connection = null;
        public DLMobilePushSendingSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSendingSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<Int32> Save(MobilePushSendingSetting mobilePushSendingSetting)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "Save", mobilePushSendingSetting.UserInfoUserId, mobilePushSendingSetting.UserGroupId, mobilePushSendingSetting.Name, mobilePushSendingSetting.MobilePushTemplateId, mobilePushSendingSetting.GroupId, mobilePushSendingSetting.TotalSent, mobilePushSendingSetting.TotalClick, mobilePushSendingSetting.TotalView, mobilePushSendingSetting.TotalClose, mobilePushSendingSetting.TotalUnsubscribed, mobilePushSendingSetting.ScheduledDate, mobilePushSendingSetting.TotalNotSent, mobilePushSendingSetting.ScheduledStatus, mobilePushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(MobilePushSendingSetting mobilePushSendingSetting)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "Update", mobilePushSendingSetting.Id, mobilePushSendingSetting.UserInfoUserId, mobilePushSendingSetting.Name, mobilePushSendingSetting.MobilePushTemplateId, mobilePushSendingSetting.GroupId, mobilePushSendingSetting.ScheduledDate, mobilePushSendingSetting.ScheduledStatus, mobilePushSendingSetting.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "MaxCount", FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MobilePushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "GetList", OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MobilePushSendingSetting?> GetDetail(int Id)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "GET", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushSendingSetting?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            string storeProcCommand = "MobilePush_SendingSetting";
            object? param = new { Action = "CheckIdentifier", IdentifierName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
