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
    public class DLContactMailSMSReminderDetailsSQL : CommonDataBaseInteraction, IDLContactMailSMSReminderDetails
    {
        CommonInfo connection;

        public DLContactMailSMSReminderDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactMailSMSReminderDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        #region Report
        public async Task<int> GetScheduledMailAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledMailAlertsMaxCount", FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<ContactMailSMSReminderDetails>> GetScheduledMailAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledMailAlertsDetails", FromDateTime, ToDateTime, UserIdList, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactMailSMSReminderDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<ContactMailSMSReminderDetails>> GetMailTemplateContent(string MailTemplateName, int Id)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "GetMailTemplateContent", MailTemplateName, Id };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactMailSMSReminderDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> DeleteScheduledMailAlerts(Int16 Id)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "DeleteScheduledMailAlert", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetScheduledSmsAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledSmsAlertsMaxCount", FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ContactMailSMSReminderDetails>> GetScheduledSmsAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledSmsAlertsDetails", FromDateTime, ToDateTime, UserIdList, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactMailSMSReminderDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> DeleteScheduledSmsAlerts(Int16 Id)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "DeleteScheduledSmsAlert", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetScheduledWhatsappAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledWhatsappAlertsMaxCount", FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ContactMailSMSReminderDetails>> GetScheduledWhatsappAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "ScheduledWhatsappAlertsDetails", FromDateTime, ToDateTime, UserIdList, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactMailSMSReminderDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> DeleteScheduledWhatsappAlerts(Int16 Id)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new { Action = "DeleteScheduledWhatsappAlert", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        #endregion

        public async Task<int> SaveScheduledAlerts(ContactMailSMSReminderDetails reminderDetails)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";

            object? param = new
            {
                Action = "SaveScheduledAlerts",
                reminderDetails.ContactId,
                reminderDetails.ScheduleType,
                reminderDetails.Name,
                reminderDetails.EmailId,
                reminderDetails.PhoneNumber,
                reminderDetails.FromEmailId,
                reminderDetails.Subject,
                reminderDetails.FromName,
                reminderDetails.AlertScheduleStatus,
                reminderDetails.AlertScheduleDate,
                reminderDetails.UserInfoUserId,
                reminderDetails.TemplateName,
                reminderDetails.TemplateContent,
                reminderDetails.MailReplyEmailId,
                reminderDetails.IsPromotionalOrTransnational,
                reminderDetails.TemplateId,
                reminderDetails.CCEmailId,
                reminderDetails.LmsGroupId,
                reminderDetails.LmsGroupMemberId,
                reminderDetails.Score,
                reminderDetails.LeadLabel,
                reminderDetails.Publisher
            };


            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> UpdateScheduledMailAlerts(ContactMailSMSReminderDetails reminderDetails)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";

            object? param = new
            {
                Action = "UpDateScheduledMailAlerts",
                reminderDetails.Id,
                reminderDetails.IsPromotionalOrTransnational,
                reminderDetails.EmailId,
                reminderDetails.Subject,
                reminderDetails.FromName,
                reminderDetails.FromEmailId,
                reminderDetails.TemplateName,
                reminderDetails.TemplateContent,
                reminderDetails.MailReplyEmailId,
                reminderDetails.AlertScheduleDate,
                reminderDetails.TemplateId,
                reminderDetails.CCEmailId,
                reminderDetails.Score,
                reminderDetails.LeadLabel,
                reminderDetails.Publisher
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateScheduledSmsAlerts(ContactMailSMSReminderDetails reminderDetails)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";

            object? param = new
            {
                Action = "UpDateScheduledSmsAlerts",
                reminderDetails.Id,
                reminderDetails.IsPromotionalOrTransnational,
                reminderDetails.PhoneNumber,
                reminderDetails.TemplateName,
                reminderDetails.TemplateContent,
                reminderDetails.AlertScheduleDate,
                reminderDetails.TemplateId,
                reminderDetails.Score,
                reminderDetails.LeadLabel,
                reminderDetails.Publisher
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateScheduledWhatsappAlerts(ContactMailSMSReminderDetails reminderDetails)
        {
            string storeProcCommand = "ContactMailSMSReminder_Details";
            object? param = new
            {
                Action = "UpdateScheduledWhatsAppAlerts",
                reminderDetails.Id,
                reminderDetails.IsPromotionalOrTransnational,
                reminderDetails.PhoneNumber,
                reminderDetails.TemplateName,
                reminderDetails.TemplateContent,
                reminderDetails.AlertScheduleDate,
                reminderDetails.TemplateId,
                reminderDetails.Score,
                reminderDetails.LeadLabel,
                reminderDetails.Publisher
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
