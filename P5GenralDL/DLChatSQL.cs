using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLChatSQL : CommonDataBaseInteraction, IDLChat
    {
        CommonInfo connection;
        public DLChatSQL(int adsId)
        {
            connection = GetDBConnection();
        }
        public DLChatSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatDetails chat)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new
            { Action="Save", chat.UserInfoUserId, chat.Name, chat.Header, chat.MinimisedWindow, chat.ForegroundColor, chat.BackgroundColor, chat.Position, chat.Privacy, chat.ChatStatus, chat.DesignType, chat.CustomTitle, chat.OfflineTitle, chat.WelcomeMesg, chat.AgentAwayMesg, chat.AgentOfflineMsg, chat.ChatEndMesg, chat.DesktopNotificationVisitor, chat.SoundNotificationVisitor, chat.SuggestionMesg, chat.IdleTime, chat.IsNameMandatory, chat.IsPhoneMandatory, chat.IsQueryMandatory, chat.HideShowP5Logo, chat.AutoMessageToVisitor, chat.ReportToDetailsByMail, chat.WebHooks, chat.WebHooksFinalUrl, chat.ShowGreetingMsg, chat.ShowEngagedMsg, chat.FormOnlineTitle, chat.FormOfflineTitle, chat.ShowIfAgentOnline, chat.ShowAutoMessageMobile, chat.GroupId, chat.AssignToUserId, chat.WebHookId, chat.IsPreChatSurvey,chat.NamePlaceholderText,chat.EmailPlaceholderText,chat.PhonePlaceholderText,chat.PrivacyContent,chat.ButtonText,chat.ResponseMessage,
                    chat.ResponseMessageTextColor,chat.AgentMessageBgColor,chat.AgentMessageForeColor,chat.VisitorMessageBgColor,chat.VisitorMessageForeColor, chat.ChatBodyBackgroundColor };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(ChatDetails chat)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new
            { Action="Update", chat.Id, chat.UserInfoUserId, chat.Name, chat.Header, chat.MinimisedWindow, chat.ForegroundColor, chat.BackgroundColor, chat.Position, chat.Privacy, chat.DesignType, chat.CustomTitle, chat.OfflineTitle, chat.WelcomeMesg, chat.AgentAwayMesg, chat.AgentOfflineMsg, chat.ChatEndMesg, chat.DesktopNotificationVisitor, chat.SoundNotificationVisitor, chat.SuggestionMesg, chat.IdleTime, chat.IsNameMandatory, chat.IsPhoneMandatory, chat.IsQueryMandatory, chat.HideShowP5Logo, chat.AutoMessageToVisitor, chat.ReportToDetailsByMail, chat.WebHooks, chat.WebHooksFinalUrl, chat.ShowGreetingMsg, chat.ShowEngagedMsg, chat.FormOnlineTitle, chat.FormOfflineTitle, chat.ShowIfAgentOnline, chat.ShowAutoMessageMobile, chat.GroupId, chat.AssignToUserId, chat.WebHookId, chat.IsPreChatSurvey,chat.NamePlaceholderText,chat.EmailPlaceholderText,chat.PhonePlaceholderText,chat.PrivacyContent,chat.ButtonText,chat.ResponseMessage,
                    chat.ResponseMessageTextColor,chat.AgentMessageBgColor,chat.AgentMessageForeColor,chat.VisitorMessageBgColor,chat.VisitorMessageForeColor, chat.ChatBodyBackgroundColor };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ChatDetails>> GET(ChatDetails chat, int OffSet, int FetchNext, List<string> fieldName = null)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action= "GET", chat.Id, chat.Name, OffSet, FetchNext, fieldName =string.Join(",", fieldName.ToArray())};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<ChatDetails?> GET(ChatDetails chat, List<string> fieldName = null)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action= "GET", chat.Id, chat.Name, fieldName=string.Join(",", fieldName.ToArray())};

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatDetails?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<int> GetMaxCount(ChatDetails chat)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action= "MaxCount", chat.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(Int32 Id)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }

        public async Task<bool> ToogleStatus(Int16 chatId, bool ChatStatus)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action = "ToogleStatus", chatId, ChatStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> ChangePriority(int Id, Int16 ChatPriority)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action = "UpdatePriorityStatus", Id, ChatPriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> UpdateAgentOnlineStatus(ChatDetails chat)
        {
            string storeProcCommand = "Chat_Details";
            object? param = new { Action = "UpdateAgentOnline", chat.Id, chat.IsAgentOnline };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

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
