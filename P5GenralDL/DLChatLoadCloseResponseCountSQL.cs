using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;


namespace P5GenralDL
{
    public class DLChatLoadCloseResponseCountSQL : CommonDataBaseInteraction, IDLChatLoadCloseResponseCount
    {
        CommonInfo connection;
        public DLChatLoadCloseResponseCountSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<int> SaveUpdateForImpression(int ChatId)
        {
            string storeProcCommand = "Chat_LoadCloseResponseCount";
            object? param = new { @Action = "SaveUpdateForImpression", ChatId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public void UpdateFormClose(int ChatId)
        {
            string storeProcCommand = "Chat_LoadCloseResponseCount";
            object? param = new { @Action = "UpdateFormClose", ChatId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
    }
}

