﻿using DBInteraction;
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
    public class DLWhatsAppTemplatesSQL : CommonDataBaseInteraction, IDLWhatsAppTemplates
    {
        CommonInfo connection;

        public DLWhatsAppTemplatesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<int> GetMaxCount(WhatsAppTemplates whatsAppTemplate)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "MaxCount", whatsAppTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLWhatsAppTemplates>> GetList(WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetList", whatsAppTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Int32> Save(WhatsAppTemplates whatsAppTemplate)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new
            {
                Action = "SaveTemplate",
                whatsAppTemplate.UserInfoUserId,
                whatsAppTemplate.UserGroupId,
                whatsAppTemplate.WhatsAppCampaignId,
                whatsAppTemplate.Name,
                whatsAppTemplate.TemplateDescription,
                whatsAppTemplate.TemplateType,
                whatsAppTemplate.WhitelistedTemplateName,
                whatsAppTemplate.TemplateContent,
                whatsAppTemplate.TemplateLanguage,
                whatsAppTemplate.UserAttributes,
                whatsAppTemplate.IsButtonAdded,
                whatsAppTemplate.ButtonOneAction,
                whatsAppTemplate.ButtonOneText,
                whatsAppTemplate.ButtonOneType,
                whatsAppTemplate.ButtonOneURLType,
                whatsAppTemplate.ButtonOneDynamicURLSuffix,
                whatsAppTemplate.ButtonTwoAction,
                whatsAppTemplate.ButtonTwoText,
                whatsAppTemplate.ButtonTwoType,
                whatsAppTemplate.ButtonTwoURLType,
                whatsAppTemplate.ButtonTwoDynamicURLSuffix,
                whatsAppTemplate.MediaFileURL,
                whatsAppTemplate.TemplateFooter,
                whatsAppTemplate.ConvertLinkToShortenUrl
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<WhatsAppTemplates>> GetAllTemplate(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetAllTemplate" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<WhatsAppTemplates>> GetAllTemplate(IEnumerable<int> TemplateList)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GET", TemplateList = string.Join(",", TemplateList) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<WhatsAppTemplates>> GetTemplateDetails(WhatsAppTemplates whatsappTemplate, int OffSet = 0, int FetchNext = 0)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GET", whatsappTemplate.Name, whatsappTemplate.WhatsAppCampaignId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<WhatsAppTemplates?> GetSingle(int Id)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetSingle", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(WhatsAppTemplates whatsAppTemplate)
        {
            string storeProcCommand = "WhatsApp_Templates";

            object? param = new
            {
                Action = "UpdateTemplate",
                whatsAppTemplate.Id,
                whatsAppTemplate.UserInfoUserId,
                whatsAppTemplate.UserGroupId,
                whatsAppTemplate.WhatsAppCampaignId,
                whatsAppTemplate.Name,
                whatsAppTemplate.TemplateDescription,
                whatsAppTemplate.TemplateType,
                whatsAppTemplate.WhitelistedTemplateName,
                whatsAppTemplate.TemplateContent,
                whatsAppTemplate.TemplateLanguage,
                whatsAppTemplate.UserAttributes,
                whatsAppTemplate.IsButtonAdded,
                whatsAppTemplate.ButtonOneAction,
                whatsAppTemplate.ButtonOneText,
                whatsAppTemplate.ButtonOneType,
                whatsAppTemplate.ButtonOneURLType,
                whatsAppTemplate.ButtonOneDynamicURLSuffix,
                whatsAppTemplate.ButtonTwoAction,
                whatsAppTemplate.ButtonTwoText,
                whatsAppTemplate.ButtonTwoType,
                whatsAppTemplate.ButtonTwoURLType,
                whatsAppTemplate.ButtonTwoDynamicURLSuffix,
                whatsAppTemplate.MediaFileURL,
                whatsAppTemplate.TemplateFooter,
                whatsAppTemplate.ConvertLinkToShortenUrl
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<WhatsAppTemplates?> GetDetails(int WhatsAppTemplateId)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetTemplateById", WhatsAppTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<WhatsAppTemplates?> GetTemplateArchive(string Name)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetTemplateArchive", Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateTemplateStatus(int TemplateId)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "UpdateTemplateStatus", TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<int> GetArchiveMaxCount(WhatsAppTemplates whatsAppTemplate)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "MaxCount", whatsAppTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<MLWhatsAppTemplates>> GetArchiveReport(WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "GetList", whatsAppTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppTemplates>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<bool> UnArchive(int Id)
        {
            string storeProcCommand = "WhatsApp_Templates";
            object? param = new { Action = "Unarchive", Id };

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
