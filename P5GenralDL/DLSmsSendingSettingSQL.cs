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
    public class DLSmsSendingSettingSQL : CommonDataBaseInteraction, IDLSmsSendingSetting
    {
        CommonInfo connection;
        public DLSmsSendingSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsSendingSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action= "Save", smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.CampaignId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus, smsSendingSetting.TotalContact, smsSendingSetting.ScheduleBatchType, smsSendingSetting.SmsConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsSendingSetting?> Get(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "Get", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSendingSetting?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
 
        }

        public async Task<IEnumerable<SmsSendingSetting>> GetList(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting";

            object? param = new { Action = "Get", smsSendingSetting.Id, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<IEnumerable<SmsSendingSetting>> GetListforapi(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "GetList", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<Int32> SaveForForms(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "SaveForForms",smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.ScheduleBatchType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "Update", smsSendingSetting.Id, smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateSentCount(int SmsSendingSettingId, int TotalSentCount, int TotalNotSentCount)
        {
            string storeProcCommand = "Sms_SendingSetting";

            object? param = new { Action = "Delete", SmsSendingSettingId, TotalSentCount, TotalNotSentCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "CheckIdentifier", IdentifierName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateScheduledCampaign(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "UpdateScheduledCampaign", smsSendingSetting.Id, smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.CampaignId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus, smsSendingSetting.TotalContact, smsSendingSetting.ScheduleBatchType, smsSendingSetting.SmsConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async void UpdateSmsCampaignSendStatus(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "UpdateSmsCampaignSendStatus", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<SmsSendingSetting>> GetRecentSmsCampaignsForInterval()
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "GetRecentSmsCampaignsForInterval"  };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<SmsSendingSetting>> GetRecentSmsCampaignsForDailyOnce(int DaysLimit)
        {
            string storeProcCommand = "Sms_SendingSetting";
            object? param = new { Action = "GetRecentSmsCampaignsForDailyOnce", DaysLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateStoppedErrorStatus(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "Sms_SendingSetting)";
            object? param = new { Action = "UpdateStoppedErrorStatus",smsSendingSetting.Id, smsSendingSetting.StoppedReason, smsSendingSetting.ScheduledStatus };
            using var db = GetDbConnection(connection.Connection);
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
