using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLChatSettingSQL : CommonDataBaseInteraction, IDLChatSetting
    {
        CommonInfo connection;
        public DLChatSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int16> Save(ChatSetting ChatSetting)
        {
            string storeProcCommand = "Chat_Setting";
            object? param = new { @Action = "Save", ChatSetting.UserLimit };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<ChatSetting?> GET()
        {
            string storeProcCommand = "Chat_Setting";
            object? param = new { @Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatSetting?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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



