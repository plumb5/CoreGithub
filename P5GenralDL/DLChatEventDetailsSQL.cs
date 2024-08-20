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
    public class DLChatEventDetailsSQL : CommonDataBaseInteraction, IDLChatEventDetails
    {
        CommonInfo connection;
        public DLChatEventDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatEventDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task Save(ChatEventDetails ChatEventDetails)
        {
            string storeProcCommand = "ChatEvent_Details";
            object? param = new { Action = "Save", ChatEventDetails.ChatUserId, ChatEventDetails.AgentId, ChatEventDetails.Url, ChatEventDetails.EventType, ChatEventDetails.ChatBannerId, ChatEventDetails.BannerTitle, ChatEventDetails.RedirectUrl };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ChatEventDetails>> GetChatEventDetailsList(ChatEventDetails ChatEventDetails)
        {
            string storeProcCommand = "ChatEvent_Details";
            object? param = new { Action = "Get", ChatEventDetails.ChatUserId, ChatEventDetails.AgentId, ChatEventDetails.Url, ChatEventDetails.EventType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatEventDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLChatEventDetails>> GetOverView(string ChatUserId)
        {
            string storeProcCommand = "ChatEvent_Details";
            object? param = new { Action = "GetOverView", ChatUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatEventDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
