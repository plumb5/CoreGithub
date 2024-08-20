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
    public class DLChatInteractionPG : CommonDataBaseInteraction, IDLChatInteraction
    {
        readonly CommonInfo connection;
        public DLChatInteractionPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatInteractionPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public void InsertMessage(int chatId, string userId, string chatRoom, string message, string sessionRefer)
        {
            string storeProcCommand = "select chat_roommesg_save(@ChatId, @UserId, @ChatRoom, @Message, @SessionRefer)";
            object? param = new { chatId, userId, chatRoom, message, sessionRefer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public void UpdateDetails(int chatId, string userId, string userIdName, string name, string emailId, string message, string phoneNumber, string SessionRefeer)
        {
            string storeProcCommand = "select chat_roommesg_save(@ChatId, @UserId, @ChatRoom, @Message, @SessionRefer)";
            object? param = new { chatId, userId, userIdName, message, SessionRefeer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<ChatVisitorDetails?> GetVisitorDetails(int chatId, string userId, string sessionRefer)
        {
            string storeProcCommand = "select * from chat_userdetails_getchatvisitor(@ChatId, @UserId, @SessionRefer)";
            object? param = new { chatId, userId, sessionRefer };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatVisitorDetails?>(storeProcCommand);
        }

        public async Task<List<ChatFullTranscipt>> GetTodayMessage(int chatId, string userId)
        {
            string storeProcCommand = "select * from chat_userdetails_todaymesg(@ChatId,@ChatUserId)";
            object? param = new { chatId, userId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatFullTranscipt>(storeProcCommand, param)).ToList();

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

