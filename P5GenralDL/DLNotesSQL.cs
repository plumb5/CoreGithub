using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLNotesSQL : CommonDataBaseInteraction, IDLNotes
    {
        CommonInfo connection = null;
        public DLNotesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLNotesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<bool> Save(Notes notes)
        {
            string storeProcCommand = "Lms_Notes";
            object? param = new { @Action = "Save", notes.ContactId, notes.Content, notes.Attachment, notes.UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<List<Notes>> GetList(int ContactId)
        {
            string storeProcCommand = "Lms_Notes";
            object? param = new { @Action = "Get", ContactId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Notes>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
