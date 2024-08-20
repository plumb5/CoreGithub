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
    public class DLSmsSendingSettingPG : CommonDataBaseInteraction, IDLSmsSendingSetting
    {
        CommonInfo connection;
        public DLSmsSendingSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsSendingSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "select sms_sendingsetting_save(@UserInfoUserId, @UserGroupId, @Name, @SmsTemplateId, @GroupId, @IsPromotionalOrTransactionalType, @CampaignId, @ScheduledDate, @ScheduledStatus, @TotalContact, @ScheduleBatchType, @SmsConfigurationNameId )";
            object? param = new { smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.CampaignId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus, smsSendingSetting.TotalContact, smsSendingSetting.ScheduleBatchType, smsSendingSetting.SmsConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<SmsSendingSetting?> Get(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from sms_sendingsetting_getbyid(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSendingSetting?>(storeProcCommand, param);

        }

        public async Task<IEnumerable<SmsSendingSetting>> GetList(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "select * from sms_sendingsetting_get(@Id, @Name, @SmsTemplateId, @GroupId)";
             
            object? param = new { smsSendingSetting.Id, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param);
        }
        public async Task<IEnumerable<SmsSendingSetting>> GetListforapi(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from sms_sendingsetting_getlist(@SmsSendingSettingId)"; 
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param);
        }
        public async Task<Int32> SaveForForms(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "select sms_sendingsetting_saveforforms(@UserInfoUserId, @UserGroupId, @Name, @SmsTemplateId, @GroupId, @IsPromotionalOrTransactionalType, @ScheduleBatchType)"; 
            object? param = new { smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.ScheduleBatchType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  Update(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "select sms_sendingsetting_update(@Id, @UserInfoUserId, @UserGroupId, @Name, @SmsTemplateId, @GroupId, @ScheduledDate, @ScheduledStatus)";
            object? param = new { smsSendingSetting.Id, smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select sms_sendingsetting_delete(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateSentCount(int SmsSendingSettingId, int TotalSentCount, int TotalNotSentCount)
        {
            string storeProcCommand = "select sms_sendingsetting_updatesentcount(@SmsSendingSettingId, @TotalSentCount, @TotalNotSentCount)";
            
            object? param = new { SmsSendingSettingId, TotalSentCount, TotalNotSentCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> CheckIdentifier(string IdentifierName)
        {
            string storeProcCommand = "select sms_sendingsetting_checkidentifier(@IdentifierName)";
            object? param = new { IdentifierName }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateScheduledCampaign(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "select sms_sendingsetting_updatescheduledcampaign (@Id, @UserInfoUserId, @UserGroupId, @Name, @SmsTemplateId, @GroupId, @IsPromotionalOrTransactionalType, @CampaignId, @ScheduledDate, @ScheduledStatus, @TotalContact, @ScheduleBatchType, @SmsConfigurationNameId)";
            object? param = new { smsSendingSetting.Id, smsSendingSetting.UserInfoUserId, smsSendingSetting.UserGroupId, smsSendingSetting.Name, smsSendingSetting.SmsTemplateId, smsSendingSetting.GroupId, smsSendingSetting.IsPromotionalOrTransactionalType, smsSendingSetting.CampaignId, smsSendingSetting.ScheduledDate, smsSendingSetting.ScheduledStatus, smsSendingSetting.TotalContact, smsSendingSetting.ScheduleBatchType, smsSendingSetting.SmsConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async void UpdateSmsCampaignSendStatus(int SmsSendingSettingId)
        {
            string storeProcCommand = "select sms_sendingsetting_updatesmscampaignsendstatus (@SmsSendingSettingId)"; 
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }

        public async Task<IEnumerable<SmsSendingSetting>>  GetRecentSmsCampaignsForInterval()
        {
            string storeProcCommand = "select sms_sendingsetting_getrecentsmscampaignsforinterval()";
             
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand);
        }

        public async Task<IEnumerable<SmsSendingSetting>> GetRecentSmsCampaignsForDailyOnce(int DaysLimit)
        {
            string storeProcCommand = "select * from sms_sendingsetting_getrecentsmscampaignsfordailyonce(@DaysLimit)"; 
            object? param = new { DaysLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param);
        }

        public async Task<bool> UpdateStoppedErrorStatus(SmsSendingSetting smsSendingSetting)
        {
            string storeProcCommand = "sms_sendingsetting_updatestoppederrorstatus(@Id,@StoppedReason,@ScheduledStatus)"; 
            object? param = new { smsSendingSetting.Id, smsSendingSetting.StoppedReason, smsSendingSetting.ScheduledStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
