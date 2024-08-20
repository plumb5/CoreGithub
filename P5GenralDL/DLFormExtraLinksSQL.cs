using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLFormExtraLinksSQL : CommonDataBaseInteraction, IDLFormExtraLinks
    {
        CommonInfo connection = null;
        public DLFormExtraLinksSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLFormExtraLinksSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int16> Save(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "Form_ExtraLinks";
            object? param = new { @Action = "Save", formExtraLinks.UserInfoUserId, formExtraLinks.LinkType, formExtraLinks.LinkUrl, formExtraLinks.LinkUrlDescription, formExtraLinks.LinkPlacecode, formExtraLinks.LinkAddCsscode, formExtraLinks.FormId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "Form_ExtraLinks";
            object? param = new { @Action = "Update", formExtraLinks.UserInfoUserId, formExtraLinks.LinkType, formExtraLinks.LinkUrl, formExtraLinks.Id, formExtraLinks.LinkUrlDescription, formExtraLinks.LinkPlacecode, formExtraLinks.LinkAddCsscode, formExtraLinks.FormId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "Form_ExtraLinks";
            object? param = new { @Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<FormExtraLinks>> GET(bool? ToogleStatus = null)
        {
            string storeProcCommand = "Form_ExtraLinks";
            object? param = new { @Action = "GET", ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormExtraLinks>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> ToogleStatus(FormExtraLinks formExtraLinks)
        {
            string storeProcCommand = "Form_ExtraLinks";
            object? param = new { @Action = "ToogleStatus", formExtraLinks.Id, formExtraLinks.ToogleStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

