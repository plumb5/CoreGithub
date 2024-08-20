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
    public class DLChatBotResponseSettingPG : CommonDataBaseInteraction, IDLChatBotResponseSetting
    {
        readonly CommonInfo connection;
        public DLChatBotResponseSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatBotResponseSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(ChatBotResponseSetting responseSetting)
        {
            string storeProcCommand = "select chatbot_responsesetting_save(@UserInfoUserId, @ChatBotId, @ReportToMailIds, @AssignToUserId, @AssignToGroupId, @AssignToLmsGroupId, @IsAssignIndividualOrBasedOnRule, @SourceType)";
            object? param = new { responseSetting.UserInfoUserId, responseSetting.ChatBotId, responseSetting.ReportToMailIds, responseSetting.AssignToUserId, responseSetting.AssignToGroupId, responseSetting.AssignToLmsGroupId, responseSetting.IsAssignIndividualOrBasedOnRule, responseSetting.SourceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(ChatBotResponseSetting responseSetting)
        {
            string storeProcCommand = "select chatbot_responsesetting_update(@Id, @ChatBotId, @ReportToMailIds, @AssignToUserId, @AssignToGroupId, @AssignToLmsGroupId, @IsAssignIndividualOrBasedOnRule, @SourceType)";
            object param = new { responseSetting.Id, responseSetting.ChatBotId, responseSetting.ReportToMailIds, responseSetting.AssignToUserId, responseSetting.AssignToGroupId, responseSetting.AssignToLmsGroupId, responseSetting.IsAssignIndividualOrBasedOnRule, responseSetting.SourceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<ChatBotResponseSetting?> GetDetails()
        {
            string storeProcCommand = "select * from chatbot_responsesetting_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatBotResponseSetting?>(storeProcCommand);
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
