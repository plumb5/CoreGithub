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
    public class DLChatBotResponseSettingSQL : CommonDataBaseInteraction, IDLChatBotResponseSetting
    {
        readonly CommonInfo connection;
        public DLChatBotResponseSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatBotResponseSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(ChatBotResponseSetting responseSetting)
        {
            string storeProcCommand = "ChatBot_ResponseSetting";
            object? param = new { Action = "Save", responseSetting.UserInfoUserId, responseSetting.ChatBotId, responseSetting.ReportToMailIds, responseSetting.AssignToUserId, responseSetting.AssignToGroupId, responseSetting.AssignToLmsGroupId, responseSetting.IsAssignIndividualOrBasedOnRule, responseSetting.SourceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ChatBotResponseSetting responseSetting)
        {
            string storeProcCommand = "ChatBot_ResponseSetting";
            object param = new { Action = "Save", responseSetting.Id, responseSetting.ChatBotId, responseSetting.ReportToMailIds, responseSetting.AssignToUserId, responseSetting.AssignToGroupId, responseSetting.AssignToLmsGroupId, responseSetting.IsAssignIndividualOrBasedOnRule, responseSetting.SourceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<ChatBotResponseSetting?> GetDetails()
        {
            string storeProcCommand = "ChatBot_ResponseSetting";
            object? param = new { Action = "Get" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatBotResponseSetting?>(storeProcCommand, commandType: CommandType.StoredProcedure);
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
