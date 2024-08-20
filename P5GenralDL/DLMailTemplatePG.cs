using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMailTemplatePG : CommonDataBaseInteraction, IDLMailTemplate
    {
        CommonInfo connection = null;
        public DLMailTemplatePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplatePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailTemplate mailTemplate)
        {
            string storeProcCommand = "select * from mail_template_save(@UserInfoUserId, @UserGroupId, @MailCampaignId, @Name, @TemplateDescription, @TemplateStatus, @IsBeeTemplate, @SubjectLine)";
            object? param = new { mailTemplate.UserInfoUserId, mailTemplate.UserGroupId, mailTemplate.MailCampaignId, mailTemplate.Name, mailTemplate.TemplateDescription, mailTemplate.TemplateStatus, mailTemplate.IsBeeTemplate, mailTemplate.SubjectLine };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MailTemplate>> GET(MailTemplate mailTemplate, int FetchNext, int OffSet, string ListOfMailTemplateId, List<string> fieldName)
        {
            string storeProcCommand = "select * from mail_template_get(@Id,@MailCampaignId, @Name, @FetchNext, @OffSet, @ListOfMailTemplateId)";
            object? param = new { Id = 0, mailTemplate.MailCampaignId, mailTemplate.Name, FetchNext, OffSet, ListOfMailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplate>(storeProcCommand, param)).ToList();
        }

        public MailTemplate GETDetails(MailTemplate mailTemplate)
        {
            string storeProcCommand = "select *  from mail_template_getdetails(@Id, @Name,@IsBeeTemplate)";
            object? param = new { mailTemplate.Id, mailTemplate.Name, mailTemplate.IsBeeTemplate };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<MailTemplate>(storeProcCommand, param);
        }

        public async Task<int> GetMaxCount(MailTemplate mailTemplate)
        {
            string storeProcCommand = "select * from mail_template_maxcount(@Name)";
            object? param = new { mailTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<int> GetArchiveMaxCount(MailTemplate mailTemplate)
        {
            string storeProcCommand = "select * from mail_template_getarchivemaxcount(@Name)";
            object? param = new { mailTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailTemplate>> GetArchiveList(MailTemplate mailTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from mail_template_getarchivelist(@Name, @OffSet, @FetchNext)";
            object? param = new { mailTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from mail_template_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> RestoreTemplate(int Id)
        {
            string storeProcCommand = "select * from mail_template_restoretemplate(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }
        public async Task<MailTemplate?> GetArchiveTemplate(string Name, bool IsBeeTemplate)
        {
            string storeProcCommand = "select * from mail_template_getarchivetemplate(@Name,@IsBeeTemplate)";
            object? param = new { Name, IsBeeTemplate };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailTemplate?>(storeProcCommand, param);
        }
        public async Task<bool> UpdateArchiveStatus(int Id)
        {
            string storeProcCommand = "select * from mail_template_updatearchivestatus(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateSpamScore(MailTemplate mailTemplate)
        {
            string ContentFromSpamAssassin = mailTemplate.ContentFromSpamAssassin.Replace("'", "");
            string storeProcCommand = "select * from mail_template_updatespamscore(@Id,@SpamScore,@ContentFromSpamAssassin)";
            object? param = new { mailTemplate.Id, mailTemplate.SpamScore, ContentFromSpamAssassin };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLMailTemplate>> GetAllTemplateList(IEnumerable<int> templatesIdList)
        {
            string template = string.Join(",", templatesIdList);
            int Id = 0;
            int Mailcampaignid = 0;
            string Name = null;
            int Fetchnext = 0;
            int Offset = 0;

            string storeProcCommand = "select *  from mail_template_get(@Id, @Mailcampaignid, @Name, @Fetchnext, @Offset, @template)";
            object? param = new { Id, Mailcampaignid, Name, Fetchnext, Offset, template };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param)).ToList();
        }
        public async Task<List<MLMailTemplate>> GetList(MailTemplate mailTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from mail_template_getlist(@Name, @Offset, @Fetchnext)";
            object? param = new { mailTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param)).ToList();
        }
        public async Task<bool> UpdateBasicDetails(MailTemplate mailTemplate)
        {
            try
            {
                string storeProcCommand = "select * from mail_template_updatebasicdetails(@Id,@Name, @TemplateDescription, @SubjectLine)";
                object? param = new { mailTemplate.Id, mailTemplate.Name, mailTemplate.TemplateDescription, mailTemplate.SubjectLine };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<List<MailTemplate>> GetAllTemplateList()
        {
            string template = null;
            int Id = 0;
            int Mailcampaignid = 0;
            string Name = null;
            int Fetchnext = 0;
            int Offset = 0;

            string storeProcCommand = "select *  from mail_template_get(@Id, @Mailcampaignid, @Name, @Fetchnext, @Offset, @template)";
            object? param = new { Id, Mailcampaignid, Name, Fetchnext, Offset, template };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplate>(storeProcCommand, param)).ToList();
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
