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
    public class DLSmsTemplatePG : CommonDataBaseInteraction, IDLSmsTemplate
    {
        CommonInfo connection;

        public DLSmsTemplatePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsTemplatePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsTemplate smsTemplate)
        {
            string storeProcCommand = "select * from sms_template_save(@UserInfoUserId, @UserGroupId,@SmsCampaignId, @Name, @MessageContent, @LandingPageType, @ProductGroupName, @Description, @VendorTemplateId, @DLTUploadMessageFile, @IsPromotionalOrTransactionalType, @Sender, @ConvertLinkToShortenUrl )";
            object? param = new { smsTemplate.UserInfoUserId, smsTemplate.UserGroupId, smsTemplate.SmsCampaignId, smsTemplate.Name, smsTemplate.MessageContent, smsTemplate.LandingPageType, smsTemplate.ProductGroupName, smsTemplate.Description, smsTemplate.VendorTemplateId, smsTemplate.DLTUploadMessageFile, smsTemplate.IsPromotionalOrTransactionalType, smsTemplate.Sender, smsTemplate.ConvertLinkToShortenUrl };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  Update(SmsTemplate smsTemplate)
        {
            try
            {
                string storeProcCommand = "select * from sms_template_update(@Id, @UserInfoUserId, @UserGroupId,@SmsCampaignId,@Name, @MessageContent,  @LandingPageType, @ProductGroupName, @Description, @VendorTemplateId, @DLTUploadMessageFile, @IsPromotionalOrTransactionalType, @Sender, @ConvertLinkToShortenUrl)";
                object? param = new { smsTemplate.Id, smsTemplate.UserInfoUserId, smsTemplate.UserGroupId, smsTemplate.SmsCampaignId, smsTemplate.Name, smsTemplate.MessageContent,  smsTemplate.LandingPageType, smsTemplate.ProductGroupName, smsTemplate.Description, smsTemplate.VendorTemplateId, smsTemplate.DLTUploadMessageFile, smsTemplate.IsPromotionalOrTransactionalType, smsTemplate.Sender, smsTemplate.ConvertLinkToShortenUrl };
                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
            }
            catch (Exception e) { 
            return false;
            }
        }

        public async Task<IEnumerable<SmsTemplate>> GetTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0)
        {
            try
            {
                int Id = 0;
                string templateidlist = null;
                string storeProcCommand = "select * from sms_template_get(@Id,@Name,@SmsCampaignId,@templateidlist,@OffSet, @FetchNext)";
                object? param = new { Id, smsTemplate.Name, smsTemplate.SmsCampaignId, templateidlist, OffSet, FetchNext };
                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<IEnumerable<SmsTemplate>> GetArchiveTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0)
        {
            int Id = 0;
            string templateidlist = null;
            string storeProcCommand = "select * from sms_template_archivalget(@Id,@Name,@SmsCampaignId,@templateidlist,@OffSet, @FetchNext)";
            object? param = new { Id, smsTemplate.Name, smsTemplate.SmsCampaignId, templateidlist, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
        }

        public async Task<bool> RestoreTemplate(int Id)
        {
            string storeProcCommand = "select * from sms_template_restoretemplate(@Id)"; 
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<IEnumerable<SmsTemplate>> GetDetails(SmsTemplate smsTemplate)
        {
            int Id = 0;
            string templateidlist = null;
            int OffSet = 0;
            int FetchNext = 0;
            string storeProcCommand = "select * from sms_template_get(@Id,@Name,@SmsCampaignId,@templateidlist,@OffSet, @FetchNext)";
            object? param = new { Id, smsTemplate.Name, smsTemplate.SmsCampaignId, templateidlist, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
        }

        //this method has been commneted and once who is changing please do the changes accordinly
        public async Task<IEnumerable<SmsTemplate>> GetAllTemplate(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {

            string storeProcCommand = "select * from sms_template_getalltemplate()";   

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand);
        }

        public async Task<SmsTemplate?> GetDetails(int SmsTemplateId)
        {
            string storeProcCommand = "select * from sms_template_gettemplatebyid(@SmsTemplateId)";
             
            object? param = new { SmsTemplateId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param);
        }

        public async Task<SmsTemplate?> GetDetailsByName(string Name)
        {
            string storeProcCommand = "select * from  sms_template_gettemplate(@Name)"; 
            object? param = new { Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param);
        }

        public async Task<SmsTemplate?> GetTemplateArchive(string Name)
        {
            string storeProcCommand = "select * from sms_template_gettemplatearchive(@Name)"; 
            object? param = new { Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsTemplate?>(storeProcCommand, param);
        }

        public async Task<Int32> GetMaxCount(SmsTemplate smsTemplate)
        {
            int Id = 0;
            string templateidlist = null;
            string storeProcCommand = "select * from sms_template_maxcount(@Id,@Name,@SmsCampaignId,@templateidlist)"; 
            object? param = new { Id, smsTemplate.Name, smsTemplate.SmsCampaignId, templateidlist };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }

        public async Task<Int32> GetArchiveMaxCount(SmsTemplate smsTemplate)
        {
            int Id = 0;
            string templateidlist = null;
            string storeProcCommand = "select * from sms_template_archivemaxcount(@Id,@Name,@SmsCampaignId,@templateidlist)"; 
            object? param = new { Id, smsTemplate.Name, smsTemplate.SmsCampaignId, templateidlist };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool>  Delete(int Id)
        {
            string storeProcCommand = "select * from sms_template_delete(@Id)"; 
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<SmsTemplate>> GetAllTemplate(IEnumerable<int> TemplateList)
        {
            int Id = 0;
            string templateidlist = string.Join(",", TemplateList);
            string Name = null;
            int OffSet = 0;
            int SmsCampaignId = 0;
            int FetchNext = 0;
            string storeProcCommand = "select * from sms_template_get(@Id,@Name,@SmsCampaignId,@templateidlist,@OffSet, @FetchNext)";
            object? param = new { Id, Name, SmsCampaignId, templateidlist, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
        }


        public async Task<bool>   UpdateTemplateStatus(int TemplateId)
        {
            string storeProcCommand = "select * from sms_template_updatetemplatestatus(@TemplateId)"; 
            object? param = new { TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
