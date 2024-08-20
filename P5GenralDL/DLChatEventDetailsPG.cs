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
    public class DLChatEventDetailsPG : CommonDataBaseInteraction, IDLChatEventDetails
    {
        CommonInfo connection;
        public DLChatEventDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatEventDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task Save(ChatEventDetails ChatEventDetails)
        {
            string storeProcCommand = "select chatevent_details_save(@ChatUserId, @AgentId, @Url, @EventType, @ChatBannerId, @BannerTitle, @RedirectUrl)";
            object? param = new { ChatEventDetails.ChatUserId, ChatEventDetails.AgentId, ChatEventDetails.Url, ChatEventDetails.EventType, ChatEventDetails.ChatBannerId, ChatEventDetails.BannerTitle, ChatEventDetails.RedirectUrl };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<ChatEventDetails>> GetChatEventDetailsList(ChatEventDetails ChatEventDetails)
        {
            string storeProcCommand = "select * from chatevent_details_get(@ChatUserId, @AgentId, @Url, @EventType)";
            object? param = new { ChatEventDetails.ChatUserId, ChatEventDetails.AgentId, ChatEventDetails.Url, ChatEventDetails.EventType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatEventDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLChatEventDetails>> GetOverView(string ChatUserId)
        {
            string storeProcCommand = "select * from chatevent_details_getoverview(@ChatUserId)";
            object? param = new { ChatUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatEventDetails>(storeProcCommand, param)).ToList();
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
