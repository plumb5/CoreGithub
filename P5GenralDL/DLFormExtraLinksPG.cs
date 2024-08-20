using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLFormExtraLinksPG : CommonDataBaseInteraction, IDLFormExtraLinks
    {
        CommonInfo connection = null;
        public DLFormExtraLinksPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLFormExtraLinksPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int16> Save(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "select form_extralinks_save(@UserInfoUserId, @LinkType, @LinkUrl, @LinkUrlDescription, @LinkPlacecode, @LinkAddCsscode, @FormId)";
            object? param = new { formExtraLinks.UserInfoUserId, formExtraLinks.LinkType, formExtraLinks.LinkUrl, formExtraLinks.LinkUrlDescription, formExtraLinks.LinkPlacecode, formExtraLinks.LinkAddCsscode, formExtraLinks.FormId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<bool> Update(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "select form_extralinks_update(@UserInfoUserId, @LinkType, @LinkUrl, @Id, @LinkUrlDescription, @LinkPlacecode, @LinkAddCsscode, @FormId)";
            object? param = new { formExtraLinks.UserInfoUserId, formExtraLinks.LinkType, formExtraLinks.LinkUrl, formExtraLinks.Id, formExtraLinks.LinkUrlDescription, formExtraLinks.LinkPlacecode, formExtraLinks.LinkAddCsscode, formExtraLinks.FormId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "select form_extralinks_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<FormExtraLinks>> GET(bool? ToogleStatus = null)
        {
            string storeProcCommand = "select *  from form_extralinks_get(@ToogleStatus)";
            object? param = new { ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormExtraLinks>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> ToogleStatus(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "select form_extralinks_tooglestatus(@Id,@ToogleStatus)";
            object? param = new { formExtraLinks.Id, formExtraLinks.ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
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

