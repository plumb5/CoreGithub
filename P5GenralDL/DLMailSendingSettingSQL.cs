using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMailSendingSettingSQL : CommonDataBaseInteraction, IDLMailSendingSetting
    {
        CommonInfo connection;

        public DLMailSendingSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSendingSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "Save", mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.IsPromotionalOrTransactionalType, mailSendingSetting.CampaignId, mailSendingSetting.ScheduledDate, mailSendingSetting.ScheduledStatus, mailSendingSetting.IsMailSplit, mailSendingSetting.SplitContactPercentage, mailSendingSetting.SplitIdentifier, mailSendingSetting.SplitVariation, mailSendingSetting.ABWinningMetricRate, mailSendingSetting.ABTestDuration, mailSendingSetting.FallbackTemplate, mailSendingSetting.MailConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "Update", mailSendingSetting.Id, mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.IsPromotionalOrTransactionalType, mailSendingSetting.CampaignId, mailSendingSetting.ScheduledDate, mailSendingSetting.ScheduledStatus, mailSendingSetting.IsMailSplit, mailSendingSetting.SplitContactPercentage, mailSendingSetting.SplitIdentifier, mailSendingSetting.SplitVariation, mailSendingSetting.ABWinningMetricRate, mailSendingSetting.ABTestDuration, mailSendingSetting.FallbackTemplate, mailSendingSetting.MailConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MailSendingSetting?> GetDetail(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "GET", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSendingSetting?>(storeProcCommand, param);
        }

        public async Task<int> SaveResponseMailSettingOfForms(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "SaveResponseMailSettingOfForms", mailSendingSetting.UserInfoUserId, mailSendingSetting.UserGroupId, mailSendingSetting.Name, mailSendingSetting.MailTemplateId, mailSendingSetting.GroupId, mailSendingSetting.Subject, mailSendingSetting.FromName, mailSendingSetting.FromEmailId, mailSendingSetting.Subscribe, mailSendingSetting.Forward, mailSendingSetting.ReplyTo, mailSendingSetting.CreatedDate, mailSendingSetting.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<int> UpdateStats(int MailSendingSettingId, int TotalSentcount, int TotalNotSentcount, bool? IsMailSplit, bool? IsMailSplitTest)
        {
            try
            {
                string storeProcCommand = "Mail_SendingSetting";
                object? param = new { Action = "UpdateStats", MailSendingSettingId, TotalSentcount, TotalNotSentcount, IsMailSplit, IsMailSplitTest };

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
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "GetDetailsForEdit", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task UpdateMailCampaignSendStatus(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "UpdateMailCampaignSendStatus", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MailSendingSetting>> GetRecentMailCampaignsForInterval()
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "UpdateMailCampaignSendStatus" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MailSendingSetting>> GetRecentMailCampaignsForDailyOnce(int DaysLimit)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "GetRecentMailCampaignsForDailyOnce", DaysLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSendingSetting>(storeProcCommand)).ToList();
        }

        public async Task<bool> UpdateStoppedErrorStatus(MailSendingSetting mailSendingSetting)
        {
            string storeProcCommand = "Mail_SendingSetting";
            object? param = new { Action = "UpdateStoppedErrorStatus", mailSendingSetting.Id, mailSendingSetting.StoppedReason, mailSendingSetting.ScheduledStatus };

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
