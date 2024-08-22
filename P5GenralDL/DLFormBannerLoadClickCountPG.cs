using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLFormBannerLoadClickCountPG : CommonDataBaseInteraction, IDLFormBannerLoadClickCount
    {
        CommonInfo connection = null;
        public DLFormBannerLoadClickCountPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormBannerLoadClickCountPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public void SaveUpdateForImpression(int FormBannerId)
        {
            string storeProcCommand = "select * from form_bannerloadclickcount_saveupdateforimpression(@FormBannerId)";
            object? param = new { FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public void UpdateFormResponse(int FormBannerId)
        {
            string storeProcCommand = "select * from form_bannerloadclickcount_updateformresponse(@FormBannerId)";
            object? param = new { FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public void UpdateFormClose(int FormBannerId)
        {
            string storeProcCommand = "select * from form_bannerloadclickcount_updateformclose(@FormBannerId)";
            object? param = new { FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
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


