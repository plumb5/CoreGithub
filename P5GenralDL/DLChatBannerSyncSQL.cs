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
    public class DLChatBannerSyncSQL : CommonDataBaseInteraction, IDLChatBannerSync
    {
        CommonInfo connection = null;
        public DLChatBannerSyncSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatBannerSyncSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(ChatBanner chatbanner)
        {
            string storeProcCommand = "Chat_Banners";
            object? param = new { Action = "Save", chatbanner.BannerContent, chatbanner.RedirectUrl, chatbanner.UserInfoUserId, chatbanner.BannerTitle };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ChatBanner chatbanner)
        {
            string storeProcCommand = "Chat_Banners";
            object? param = new { Action = "Update", chatbanner.Id, chatbanner.RedirectUrl, chatbanner.BannerTitle };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Chat_Banners";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ChatBanner>> GetList(int OffSet, int FetchNext)
        {
            string storeProcCommand = "Chat_BannersChat_Banners";
            object? param = new { Action = "GetList", OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatBanner>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
