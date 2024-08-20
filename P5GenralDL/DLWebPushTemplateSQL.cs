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
    public class DLWebPushTemplateSQL : CommonDataBaseInteraction, IDLWebPushTemplate
    {
        CommonInfo connection;

        public DLWebPushTemplateSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushTemplateSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "Save", webpushTemplate.UserInfoUserId, webpushTemplate.CampaignId, webpushTemplate.TemplateName, webpushTemplate.TemplateDescription, webpushTemplate.NotificationType, webpushTemplate.Title, webpushTemplate.MessageContent, webpushTemplate.IconImage, webpushTemplate.OnClickRedirect, webpushTemplate.BannerImage, webpushTemplate.Button1_Label, webpushTemplate.Button1_Redirect, webpushTemplate.Button2_Label, webpushTemplate.Button2_Redirect, webpushTemplate.IsAutoHide, webpushTemplate.IsCustomBadge, webpushTemplate.BadgeImage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "Update", webpushTemplate.Id, webpushTemplate.CampaignId, webpushTemplate.TemplateName, webpushTemplate.TemplateDescription, webpushTemplate.NotificationType, webpushTemplate.Title, webpushTemplate.MessageContent, webpushTemplate.IconImage, webpushTemplate.OnClickRedirect, webpushTemplate.BannerImage, webpushTemplate.Button1_Label, webpushTemplate.Button1_Redirect, webpushTemplate.Button2_Label, webpushTemplate.Button2_Redirect, webpushTemplate.IsAutoHide, webpushTemplate.IsCustomBadge, webpushTemplate.BadgeImage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetMaxCount(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "MaxCount", webpushTemplate.Id, webpushTemplate.TemplateName, webpushTemplate.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> GetArchiveMaxCount(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "ArchiveMaxCount", webpushTemplate.Id, webpushTemplate.TemplateName, webpushTemplate.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<WebPushTemplate>> GetAllTemplates(WebPushTemplate webpushTemplate, int OffSet = -1, int FetchNext = 0)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GET", webpushTemplate.TemplateName, webpushTemplate.CampaignId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushTemplate>(storeProcCommand, param)).ToList();
        }

        public async Task<List<WebPushTemplate>> GetAllArchiveTemplates(WebPushTemplate webpushTemplate, int OffSet = -1, int FetchNext = 0)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GetArchive", webpushTemplate.TemplateName, webpushTemplate.CampaignId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushTemplate>(storeProcCommand, param)).ToList();
        }

        public async Task<WebPushTemplate?> GetDetails(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GET", webpushTemplate.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushTemplate>(storeProcCommand, param);
        }

        public WebPushTemplate? GetDetailsSync(WebPushTemplate webpushTemplate)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GET", webpushTemplate.Id };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<WebPushTemplate>(storeProcCommand, param);
        }

        public async Task<WebPushTemplate?> GetDetailsByName(string Name)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GetTemplate", Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushTemplate>(storeProcCommand, param);
        }

        public async Task<WebPushTemplate?> GetArchiveTemplate(string Name)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "GetArchiveTemplate", Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushTemplate>(storeProcCommand, param);
        }

        public async Task<bool> UpdateArchiveStatus(int Id)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "UpdateArchiveStatus", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> RestoreTemplate(int Id)
        {
            string storeProcCommand = "WebPush_Template";
            object? param = new { Action = "Restore", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
