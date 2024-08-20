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
    public class DLSmsTemplateSQL : CommonDataBaseInteraction, IDLSmsTemplate
    {
        CommonInfo connection;

        public DLSmsTemplateSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsTemplateSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsTemplate smsTemplate)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action= "Save", smsTemplate.UserInfoUserId, smsTemplate.UserGroupId, smsTemplate.Name, smsTemplate.SmsCampaignId, smsTemplate.MessageContent, smsTemplate.LandingPageType, smsTemplate.ProductGroupName, smsTemplate.Description, smsTemplate.VendorTemplateId, smsTemplate.DLTUploadMessageFile, smsTemplate.IsPromotionalOrTransactionalType, smsTemplate.Sender, smsTemplate.ConvertLinkToShortenUrl };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(SmsTemplate smsTemplate)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "Update", smsTemplate.Name, smsTemplate.MessageContent, smsTemplate.Id, smsTemplate.UserInfoUserId, smsTemplate.UserGroupId, smsTemplate.LandingPageType, smsTemplate.ProductGroupName, smsTemplate.Description, smsTemplate.VendorTemplateId, smsTemplate.DLTUploadMessageFile, smsTemplate.IsPromotionalOrTransactionalType, smsTemplate.Sender, smsTemplate.ConvertLinkToShortenUrl };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<SmsTemplate>> GetTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0)
        {
             
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GET", smsTemplate.Name, smsTemplate.SmsCampaignId, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsTemplate>> GetArchiveTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0)
        { 
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "ArchivalGet",  smsTemplate.Name, smsTemplate.SmsCampaignId, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RestoreTemplate(int Id)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "RestoreTemplate", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<SmsTemplate>> GetDetails(SmsTemplate smsTemplate)
        {
            
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GET", smsTemplate.Name, smsTemplate.SmsCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        //this method has been commneted and once who is changing please do the changes accordinly
        public async Task<IEnumerable<SmsTemplate>> GetAllTemplate(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {
            string UserInfoUserIdLists = UserInfoUserIdList != null ? string.Join(",", UserInfoUserIdList) : null;
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GetAllTemplate", UserInfoUserId, UserInfoUserIdLists, IsSuperAdmin };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsTemplate?> GetDetails(int SmsTemplateId)
        {
            string storeProcCommand = "Sms_Template";

            object? param = new { Action = "GetTemplateById", SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsTemplate?> GetDetailsByName(string Name)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GetTemplate", Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsTemplate?> GetTemplateArchive(string Name)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GetTemplateArchive", Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> GetMaxCount(SmsTemplate smsTemplate)
        {
             
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "MaxCount", smsTemplate.Name, smsTemplate.SmsCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> GetArchiveMaxCount(SmsTemplate smsTemplate)
        { 
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "ArchiveMaxcount",   smsTemplate.Name, smsTemplate.SmsCampaignId  };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<SmsTemplate>> GetAllTemplate(IEnumerable<int> TemplateList)
        {
             
            string templateidlist = string.Join(",", TemplateList); 
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "GET", templateidlist };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<bool> UpdateTemplateStatus(int TemplateId)
        {
            string storeProcCommand = "Sms_Template";
            object? param = new { Action = "UpdateTemplateStatus", TemplateId };

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

