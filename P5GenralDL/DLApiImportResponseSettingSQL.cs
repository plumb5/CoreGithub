using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;
using System.Threading.Tasks;
namespace P5GenralDL
{
    public class DLApiImportResponseSettingSQL : CommonDataBaseInteraction, IDLApiImportResponseSetting
    {
        CommonInfo connection = null;
        public DLApiImportResponseSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<bool> Save(ApiImportResponseSetting responseSettings)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action="Save",responseSettings.Id, responseSettings.Name, responseSettings.Status, responseSettings.ReportToDetailsByMail, responseSettings.ReportToDetailsBySMS, responseSettings.ReportToDetailsByWhatsApp, responseSettings.MailSendingSettingId, responseSettings.SmsSendingSettingId, responseSettings.WhatsAppSendingSettingId, responseSettings.AssignLeadToUserInfoUserId, responseSettings.IsOverrideAssignment, responseSettings.AssignToGroupId, responseSettings.WebHookId, responseSettings.URLParameterResponses, responseSettings.IsVerifiedEmail, responseSettings.IsAutoWhatsApp, responseSettings.AssignUserGroupId, responseSettings.IsOverRideSource, responseSettings.IsConditional, responseSettings.ConditionalJson, responseSettings.SourceType, responseSettings.IsUserAssignmentConditional, responseSettings.UserAssigmentJson, responseSettings.MailSendingConditonalJson, responseSettings.SmsSendingConditonalJson, responseSettings.WhatsAppSendingConditonalJson, responseSettings.IsAutoClickToCall, responseSettings.IsMailRepeatCon, responseSettings.IsSmsRepeatCon, responseSettings.IsWhatsappRepeatCon, responseSettings.IsCallRepeatCon, responseSettings.AssignStage, responseSettings.AssignStageConditonalJson, responseSettings.IsIncludedLeads, responseSettings.IncludedLeadsJson, responseSettings.IsExcludedLeads, responseSettings.ExcludedLeadsJson, responseSettings.AssignToGroupConditonalJson, responseSettings.IsUnConditionalGroupSticky };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<Int32> MaxCount(string Name)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "MaxCount", Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ApiImportResponseSetting>> Get(int FetchNext, int OffSet, string Name)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action= "Get",FetchNext, OffSet, Name };
            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryAsync<ApiImportResponseSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<bool> ToggleStatus(int Id, bool Status)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "ToggleStatus", Id, Status };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<ApiImportResponseSetting?> Get(string Name)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "GetDetailsByName", Name };

            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryFirstOrDefaultAsync<ApiImportResponseSetting?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> UpdateLastAssigUserIdNotificationToSales(int Id, int UserInfoUserId)
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "UpdateLastAssignedUserId", Id, UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<ApiImportResponseSetting>> GetNames()
        {
            string storeProcCommand = "ApiImport_ResponseSetting";
            object? param = new { Action = "GetNames"};
            List<string> fields = new List<string> { "Name" };
            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryAsync<ApiImportResponseSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
