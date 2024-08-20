using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailTemplateFilePG : CommonDataBaseInteraction, IDLMailTemplateFile
    {
        CommonInfo connection = null;
        public DLMailTemplateFilePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateFilePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> Save(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "select * from mail_templatefile_save(@TemplateId, @TemplateFileName, @TemplateFileType, @TemplateFileContent)";
            object? param = new { TemplateFile.TemplateId, TemplateFile.TemplateFileName, TemplateFile.TemplateFileType, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "select mail_templatefile_update(@Id,@TemplateFileContent)";
            object? param = new { TemplateFile.Id, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Delete(int TemplateId)
        {
            string storeProcCommand = "select mail_templatefile_delete(@TemplateId)";
            object? param = new { TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<MailTemplateFile>> GetTemplateFiles(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "select *  from mail_templatefile_gettemplatefiles(@TemplateId)";
            object? param = new { TemplateFile.TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplateFile>(storeProcCommand, param)).ToList();
        }

        public async Task<MailTemplateFile?> GetSingleFileType(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "select *  from mail_templatefile_getsinglefiletype(@TemplateId, @TemplateFileType)";
            object? param = new { TemplateFile.TemplateId, TemplateFile.TemplateFileType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailTemplateFile?>(storeProcCommand, param);
        }

        public MailTemplateFile? GetSingleFileTypeSync(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "select *  from mail_templatefile_getsinglefiletype(@TemplateId, @TemplateFileType)";
            object? param = new { TemplateFile.TemplateId, TemplateFile.TemplateFileType };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<MailTemplateFile?>(storeProcCommand, param);
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
