using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContactImportErrorPG : CommonDataBaseInteraction, IDLContactImportError
    {
        CommonInfo connection;
        public DLContactImportErrorPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactImportErrorPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(ContactImportError contactError)
        {
            string storeProcCommand = "select * from contactimport_error_save(@EmailId, @PhoneNumber, @ContactInfoInString, @ContactImportOverviewId, @RejectReason)";
            object? param = new { contactError.EmailId, contactError.PhoneNumber, contactError.ContactInfoInString, contactError.ContactImportOverviewId, contactError.RejectReason };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<int> GetMaxCount(int ContactImportOverviewId)
        {
            string storeProcCommand = "select * from ContactImport_Error(@Action, @ContactImportOverviewId)";
            object? param = new { Action = "GetMaxCount", ContactImportOverviewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<ContactImportError>> GetList(int ContactImportOverviewId, int OffSet = -1, int FetchNext = 0)
        {
            string storeProcCommand = "select * from contactimport_error_getlist(@OffSet,@FetchNext,@ContactImportOverviewId)";
            object? param = new { OffSet, FetchNext, ContactImportOverviewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactImportError>(storeProcCommand, param)).ToList();

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
