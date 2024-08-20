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
    public class DLChatExtraLinksSQL : CommonDataBaseInteraction, IDLChatExtraLinks
    {
        CommonInfo connection = null;
        public DLChatExtraLinksSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatExtraLinksSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(ChatExtraLinks ChatExtraLinks)
        {
            string storeProcCommand = "Chat_ExtraLinks";
            object? param = new { Action = "Save", ChatExtraLinks.UserInfoUserId, ChatExtraLinks.LinkType, ChatExtraLinks.LinkUrl, ChatExtraLinks.LinkUrlDescription };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ChatExtraLinks ChatExtraLinks)
        {
            string storeProcCommand = "Chat_ExtraLinks";
            object? param = new { Action = "Update", ChatExtraLinks.UserInfoUserId, ChatExtraLinks.LinkType, ChatExtraLinks.LinkUrl, ChatExtraLinks.Id, ChatExtraLinks.LinkUrlDescription };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "Chat_ExtraLinks";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ChatExtraLinks>> GET(bool? ToogleStatus = null)
        {
            string storeProcCommand = "Chat_ExtraLinks";
            object? param = new { Action = "GET", ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatExtraLinks>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> ToogleStatus(ChatExtraLinks ChatExtraLinks)
        {
            string storeProcCommand = "Chat_ExtraLinks";
            object? param = new { Action = "ToogleStatus", ChatExtraLinks.Id, ChatExtraLinks.ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
