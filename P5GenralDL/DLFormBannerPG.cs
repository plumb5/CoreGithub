using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLFormBannerPG : CommonDataBaseInteraction, IDLFormBanner
    {
        CommonInfo connection = null;
        public DLFormBannerPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormBannerPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(FormBanner formbanner)
        {
            string storeProcCommand = "select form_banner_save(@FormId, @Name, @BannerContent, @RedirectUrl, @Impression, @BannerStatus, @BannerId)";
            object? param = new { formbanner.FormId, formbanner.Name, formbanner.BannerContent, formbanner.RedirectUrl, formbanner.Impression, formbanner.BannerStatus, formbanner.BannerId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(FormBanner formbanner)
        {
            string storeProcCommand = "select form_banner_update(@Id, @FormId, @Name, @BannerContent, @RedirectUrl,@BannerStatus, @BannerId)";
            object? param = new { formbanner.Id, formbanner.FormId, formbanner.Name, formbanner.BannerContent, formbanner.RedirectUrl, formbanner.BannerStatus, formbanner.BannerId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }
        public async Task<List<FormBanner>> GET(int FormId)
        {
            string storeProcCommand = "select *  from form_banner_get(@FormId)";
            object? param = new { FormId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormBanner>(storeProcCommand, param)).ToList();
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

