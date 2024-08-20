using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLMailTemplateImagesPG : CommonDataBaseInteraction, IDLMailTemplateImages
    {
        CommonInfo connection = null;
        public DLMailTemplateImagesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateImagesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MailTemplateImages images)
        {
            string storeProcCommand = "select * from mail_templateimages_save(@Name, @ImageUrl, @Height, @Width)";
            object? param = new { images.Name, images.ImageUrl, images.Height, images.Width };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MailTemplateImages>> GetTemplateImagesFiles()
        {
            string storeProcCommand = "select *  from mail_templateimages_gettemplateimagesfiles()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailTemplateImages>(storeProcCommand)).ToList();
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

