using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLMailSendingSettingPG : CommonDataBaseInteraction, IDLMailSendingSetting
    {
        CommonInfo connection;

        public DLMailSendingSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSendingSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "select mail_sendingsetting_save(@UserInfoUserId, @UserGroupId, @Name, @MailTemplateId, @GroupId, @Subject, @FromName, @FromEmailId, @Subscribe, @Forward, @ReplyTo, @IsPromotionalOrTransactionalType, @CampaignId, @ScheduledDate, @ScheduledStatus, @IsMailSplit, @SplitContactPercentage, @SplitIdentifier, @SplitVariation, @ABWinningMetricRate, @ABTestDuration, @FallbackTemplate, @MailConfigurationNameId)";
            object? param = new { mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.IsPromotionalOrTransactionalType, mailSendingSetting.CampaignId, mailSendingSetting.ScheduledDate, mailSendingSetting.ScheduledStatus, mailSendingSetting.IsMailSplit, mailSendingSetting.SplitContactPercentage, mailSendingSetting.SplitIdentifier, mailSendingSetting.SplitVariation, mailSendingSetting.ABWinningMetricRate, mailSendingSetting.ABTestDuration, mailSendingSetting.FallbackTemplate, mailSendingSetting.MailConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "select mail_sendingsetting_update(@Id, @UserInfoUserId, @UserGroupId, @Name, @MailTemplateId, @GroupId, @Subject, @FromName, @FromEmailId, @Subscribe, @Forward, @ReplyTo, @IsPromotionalOrTransactionalType, @CampaignId, @ScheduledDate, @ScheduledStatus, @IsMailSplit, @SplitContactPercentage, @SplitIdentifier, @SplitVariation, @ABWinningMetricRate, @ABTestDuration, @FallbackTemplate, @MailConfigurationNameId)";
            object? param = new { mailSendingSetting.Id, mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.IsPromotionalOrTransactionalType, mailSendingSetting.CampaignId, mailSendingSetting.ScheduledDate, mailSendingSetting.ScheduledStatus, mailSendingSetting.IsMailSplit, mailSendingSetting.SplitContactPercentage, mailSendingSetting.SplitIdentifier, mailSendingSetting.SplitVariation, mailSendingSetting.ABWinningMetricRate, mailSendingSetting.ABTestDuration, mailSendingSetting.FallbackTemplate, mailSendingSetting.MailConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MailSendingSetting?> GetDetail(int MailSendingSettingId)
        {
            string storeProcCommand = "select * from mail_sendingsetting_get(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSendingSetting?>(storeProcCommand, param);
        }

        public async Task<int> SaveResponseMailSettingOfForms(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "select mail_sendingsetting_saveresponsemailsettingofforms(@UserInfoUserId, @UserGroupId, @Name, @MailTemplateId, @GroupId, @Subject, @FromName, @FromEmailId, @Subscribe, @Forward, @ReplyTo, @CreatedDate, @IsPromotionalOrTransactionalType)";
            object? param = new { mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.CreatedDate, mailSendingSetting.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<int> UpdateStats(int MailSendingSettingId, int TotalSentcount, int TotalNotSentcount, bool? IsMailSplit, bool? IsMailSplitTest)
        {
            try
            {
                string storeProcCommand = "select mail_sendingsetting_updatestats(@MailSendingSettingId, @TotalSentcount, @TotalNotSentcount, @IsMailSplit, @IsMailSplitTest)";
                object? param = new { MailSendingSettingId, TotalSentcount, TotalNotSentcount, IsMailSplit, IsMailSplitTest };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<List<MailSendingSetting>> GetDetailsForEdit(int MailSendingSettingId)
        {
            string storeProcCommand = "select * from mail_sendingsetting_getdetailsforedit(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task UpdateMailCampaignSendStatus(int MailSendingSettingId)
        {
            string storeProcCommand = "select mail_sendingsetting_updatemailcampaignsendstatus(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MailSendingSetting>> GetRecentMailCampaignsForInterval()
        {
            string storeProcCommand = "select * from mail_sendingsetting_getrecentmailcampaignsforinterval()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand)).ToList();
        }

        public async Task<List<MailSendingSetting>> GetRecentMailCampaignsForDailyOnce(int DaysLimit)
        {
            string storeProcCommand = "select * from mail_sendingsetting_getrecentmailcampaignsfordailyonce(@DaysLimit)";
            object? param = new { DaysLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand)).ToList();
        }

        public async Task<bool> UpdateStoppedErrorStatus(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "select mail_sendingsetting_updatestoppederrorstatus(@Id, @StoppedReason, @ScheduledStatus)";
            object? param = new { mailSendingSetting.Id, mailSendingSetting.StoppedReason, mailSendingSetting.ScheduledStatus };

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
