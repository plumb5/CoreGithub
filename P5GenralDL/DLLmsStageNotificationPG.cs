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
    public class DLLmsStageNotificationPG : CommonDataBaseInteraction, IDLLmsStageNotification
    {
        CommonInfo connection;
        public DLLmsStageNotificationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsStageNotificationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsStageNotification notification)
        {
            string storeProcCommand = "select lmsstage_notification_saveorupdate(@LmsStageId, @Mail, @Sms, @ReportToSeniorId, @UserGroupId, @EmailIds, @PhoneNos, @AssignUserInfoUserId, @AssignUserGroupId, @IsOpenFollowUp, @IsOpenNotes, @WhatsApp, @WhatsappPhoneNos,@MailTemplateId,@SmsTemplateId,@WhatsAppTemplateId)";
            object? param = new { notification.LmsStageId, notification.Mail, notification.Sms, notification.ReportToSeniorId, notification.UserGroupId, notification.EmailIds, notification.PhoneNos, notification.AssignUserInfoUserId, notification.AssignUserGroupId, notification.IsOpenFollowUp, notification.IsOpenNotes, notification.WhatsApp, notification.WhatsappPhoneNos, notification.MailTemplateId, notification.SmsTemplateId, notification.WhatsAppTemplateId }; ;

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> UpdateLastAssignedUserId(Int16 LMSStageId, int UserInfoUserId)
        {
            string storeProcCommand = "select lmsstage_notification_save(@LMSStageId, @UserInfoUserId )";
            object? param = new { LMSStageId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<List<LmsStageNotification>> GET()
        {
            string storeProcCommand = "select * from lmsstage_notification_get()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsStageNotification>(storeProcCommand)).ToList();
        }

        public async Task<LmsStageNotification?> GET(int StageScore)
        {
            string storeProcCommand = "select * from lmsstage_notification_getdetailsbyscore(@StageScore)";
            object? param = new { StageScore };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LmsStageNotification?>(storeProcCommand, param);

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
