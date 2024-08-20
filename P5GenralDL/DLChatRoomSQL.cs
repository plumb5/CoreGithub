using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLChatRoomSQL : CommonDataBaseInteraction, IDLChatRoom
    {
        CommonInfo connection = null;
        public DLChatRoomSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatRoomSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> BlockParticularUser(int chatId, string ChatUserId, int UserId)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "BlockUser", chatId, ChatUserId, UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> UpdateNote(int chatId, string UserId, string comments)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "UpdateNote", chatId, UserId, comments };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> UpdateContactId(string UserId, int ContactId, string UtmTagSource = null)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "UpdateContactId", UserId, ContactId, UtmTagSource };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> CityAndNames(MLChatRoom chatRoom)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "CityAndName", chatRoom.ChatId, chatRoom.UserId, chatRoom.Name, chatRoom.City };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> DesktopNotification(MLChatRoom chatRoom)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "ActiveDesktopNotifyAgent", chatRoom.ChatId, chatRoom.UserId, chatRoom.DesktopNotifyForNewVisitor };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> SoundNotify(MLChatRoom chatRoom)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "ActiveSoundNotifyAgent", chatRoom.ChatId, chatRoom.UserId, chatRoom.SoundNotify, chatRoom.SoundNewVisitorNotify, chatRoom.SoundNotificationOnVisitorConnect };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MLChatRoom?> GetAgentData(MLChatRoom chatRoom)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "GetAgentData", chatRoom.ChatId, chatRoom.UserId, chatRoom.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLChatRoom?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ChatFullTranscipt>> GetTranscriptAdmin(int chatId, string UserId)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "FullTranscript", chatId, UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatFullTranscipt>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<ChatFullTranscipt>> GetPastChat(int chatId, string UserId)
        {
            string storeProcCommand = "Chat_UserDetails";
            object? param = new { @Action= "PastChatDetails", chatId, UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatFullTranscipt>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


