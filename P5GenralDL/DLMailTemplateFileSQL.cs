using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailTemplateFileSQL : CommonDataBaseInteraction, IDLMailTemplateFile
    {
        CommonInfo connection = null;
        public DLMailTemplateFileSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateFileSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> Save(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "Save", TemplateFile.TemplateId, TemplateFile.TemplateFileName, TemplateFile.TemplateFileType, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "Update", TemplateFile.Id, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(int TemplateId)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "Delete", TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MailTemplateFile>> GetTemplateFiles(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "GetTemplateFiles", TemplateFile.TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplateFile>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MailTemplateFile?> GetSingleFileType(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "GetSingleFileType", TemplateFile.TemplateId, TemplateFile.TemplateFileType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailTemplateFile?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public MailTemplateFile? GetSingleFileTypeSync(MailTemplateFile TemplateFile)
        {
            string storeProcCommand = "Mail_TemplateFile";
            object? param = new { @Action = "GetSingleFileType", TemplateFile.TemplateId, TemplateFile.TemplateFileType };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<MailTemplateFile?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
