using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLLandingPageTemplateFilePG : CommonDataBaseInteraction, IDLLandingPageTemplateFile
    {
        CommonInfo connection = null;
        public DLLandingPageTemplateFilePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLandingPageTemplateFilePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(LandingPageTemplateFile TemplateFile)
        {
            string storeProcCommand = "select landingpage_templatefile_save(@LandingPageId, @TemplateFileName, @TemplateFileType, @TemplateFileConten)";
            object? param = new { TemplateFile.LandingPageId, TemplateFile.TemplateFileName, TemplateFile.TemplateFileType, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<bool> Update(LandingPageTemplateFile TemplateFile)
        {
            string storeProcCommand = "select landingpage_templatefile_update(@Id, @TemplateFileContent)";
            object? param = new { TemplateFile.Id, TemplateFile.TemplateFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Delete(int TemplateId)
        {
            string storeProcCommand = "select landingpage_templatefile_delete(@TemplateId)";
            object? param = new { TemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<LandingPageTemplateFile>> GetTemplateFiles(LandingPageTemplateFile TemplateFile)
        {
            string storeProcCommand = "select *  from landingpage_templatefile_gettemplatefiles(@LandingPageId)";
            object? param = new { TemplateFile.LandingPageId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LandingPageTemplateFile>(storeProcCommand, param)).ToList();
        }

        public async Task<LandingPageTemplateFile> GetSingleFileType(LandingPageTemplateFile TemplateFile)
        {
            string storeProcCommand = "select *  from landingpage_templatefile_getsinglefiletype(@LandingPageId,@TemplateFileType)";
            object? param = new { TemplateFile.LandingPageId, TemplateFile.TemplateFileType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LandingPageTemplateFile>(storeProcCommand, param);
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

