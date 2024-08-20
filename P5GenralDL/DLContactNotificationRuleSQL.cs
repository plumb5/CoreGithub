using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLContactNotificationRuleSQL : CommonDataBaseInteraction, IDLContactNotificationRule
    {
        CommonInfo connection;
        public DLContactNotificationRuleSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactNotificationRuleSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveContactNotificationRule(ContactNotificationRule leadnotificToSales)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "Save", leadnotificToSales.Name, leadnotificToSales.Mail, leadnotificToSales.Sms, leadnotificToSales.Conditions, leadnotificToSales.AssignUserInfoUserId, leadnotificToSales.AssignUserGroupId, leadnotificToSales.AutoMailSendingSettingId, leadnotificToSales.AutoSmsSendingSettingId, leadnotificToSales.AutoAssignToGroupId, leadnotificToSales.WhatsApp, leadnotificToSales.AutoWhatsAppSendingSettingId, leadnotificToSales.AutoAssignToLmsSourceId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateContactNotificationRule(ContactNotificationRule leadnotificToSales)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "Update", leadnotificToSales.Id, leadnotificToSales.Name, leadnotificToSales.Mail, leadnotificToSales.Sms, leadnotificToSales.Conditions, leadnotificToSales.AssignUserInfoUserId, leadnotificToSales.AssignUserGroupId, leadnotificToSales.AutoMailSendingSettingId, leadnotificToSales.AutoSmsSendingSettingId, leadnotificToSales.AutoAssignToGroupId, leadnotificToSales.WhatsApp, leadnotificToSales.AutoWhatsAppSendingSettingId, leadnotificToSales.AutoAssignToLmsSourceId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ContactNotificationRule>> GetRuleNotification(int Id, bool? Status = null)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "Get", Id, Status };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactNotificationRule>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> UpdateLastAssigUserIdNotificationToSales(int Id, int UserInfoUserId)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "UpdateLastAssignedUserId", Id, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteLeadNotificationToSales(int Id)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ToogleStatus(int Id, bool Status)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "ToogleStatus", Id, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ChangePriority(int Id, Int16 RulePriority)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "ChangePriority", Id, RulePriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ContactNotificationRule>> GetRules()
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "GetList" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactNotificationRule>(storeProcCommand)).ToList();
        }

        public async Task<int> GetMaxCount(string ruleName)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "MaxCount", ruleName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ContactNotificationRule>> GetRulesForBinding(int OffSet, int FetchNext, string ruleName)
        {
            string storeProcCommand = "Contact_NotificationRule";
            object? param = new { Action = "GetRulesForBinding", ruleName, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactNotificationRule>(storeProcCommand, commandType: CommandType.StoredProcedure)).ToList();
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
