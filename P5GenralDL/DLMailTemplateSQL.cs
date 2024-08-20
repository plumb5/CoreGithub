using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailTemplateSQL : CommonDataBaseInteraction, IDLMailTemplate
    {
        CommonInfo connection = null;
        public DLMailTemplateSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailTemplate mailTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "Save", mailTemplate.UserInfoUserId, mailTemplate.UserGroupId, mailTemplate.MailCampaignId, mailTemplate.Name, mailTemplate.TemplateDescription, mailTemplate.TemplateStatus, mailTemplate.IsBeeTemplate, mailTemplate.SubjectLine };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MailTemplate>> GET(MailTemplate mailTemplate, int FetchNext, int OffSet, string ListOfMailTemplateId, List<string> fieldName)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GET", mailTemplate.MailCampaignId, mailTemplate.Name, FetchNext, OffSet, ListOfMailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public MailTemplate GETDetails(MailTemplate mailTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GetDetails", mailTemplate.Id, mailTemplate.Name, mailTemplate.IsBeeTemplate };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<MailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> GetMaxCount(MailTemplate mailTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "MaxCount", mailTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> GetArchiveMaxCount(MailTemplate mailTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GetArchiveTemplate", mailTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailTemplate>> GetArchiveList(MailTemplate mailTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GetArchiveTemplate", mailTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> RestoreTemplate(int Id)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "RestoreTemplate", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<MailTemplate?> GetArchiveTemplate(string Name, bool IsBeeTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GetArchiveTemplate", Name, IsBeeTemplate };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> UpdateArchiveStatus(int Id)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "UpdateArchiveStatus", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateSpamScore(MailTemplate mailTemplate)
        {
            string ContentFromSpamAssassin = mailTemplate.ContentFromSpamAssassin.Replace("'", "");
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "UpdateSpamScore", mailTemplate.Id, mailTemplate.SpamScore, ContentFromSpamAssassin };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MLMailTemplate>> GetAllTemplateList(IEnumerable<int> templatesIdList)
        {
            string template = string.Join(",", templatesIdList);
            int Id = 0;
            int Mailcampaignid = 0;
            string Name = null;
            int Fetchnext = 0;
            int Offset = 0;

            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GET", Id, Mailcampaignid, Name, Fetchnext, Offset, template };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<MLMailTemplate>> GetList(MailTemplate mailTemplate, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GetList", mailTemplate.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<bool> UpdateBasicDetails(MailTemplate mailTemplate)
        {
            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "UpdateBasicDetails", mailTemplate.Id, mailTemplate.Name, mailTemplate.TemplateDescription, mailTemplate.SubjectLine };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MailTemplate>> GetAllTemplateList()
        {
            string template = null;
            int Id = 0;
            int Mailcampaignid = 0;
            string Name = null;
            int Fetchnext = 0;
            int Offset = 0;

            string storeProcCommand = "Mail_Template";
            object? param = new { @Action = "GET", Id, Mailcampaignid, Name, Fetchnext, Offset, template };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
