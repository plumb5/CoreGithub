using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailTemplateImagesSQL : CommonDataBaseInteraction, IDLMailTemplateImages
    {
        CommonInfo connection = null;
        public DLMailTemplateImagesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateImagesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MailTemplateImages images)
        {
            string storeProcCommand = "Mail_TemplateImages";
            object? param = new { @Action = "Save", images.Name, images.ImageUrl, images.Height, images.Width };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MailTemplateImages>> GetTemplateImagesFiles()
        {
            string storeProcCommand = "Mail_TemplateImages";
            object? param = new { @Action = "GetTemplateImagesFiles"};
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplateImages>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


