using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLNotesPG : CommonDataBaseInteraction, IDLNotes
    {
        CommonInfo connection = null;
        public DLNotesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLNotesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<bool> Save(Notes notes)
        {
            string storeProcCommand = "select lms_notes_save(@ContactId, @Content, @Attachment, @UserInfoUserId)";
            object? param = new { notes.ContactId, notes.Content, notes.Attachment, notes.UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<List<Notes>> GetList(int ContactId)
        {
            string storeProcCommand = "select * from lms_notes_get(@ContactId)";
            object? param = new { ContactId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Notes>(storeProcCommand, param)).ToList();
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


