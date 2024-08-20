using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContactEmailValidationOverViewBatchWiseDetailsSQL : CommonDataBaseInteraction, IDLContactEmailValidationOverViewBatchWiseDetails
    {
        CommonInfo connection = null;
        public DLContactEmailValidationOverViewBatchWiseDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactEmailValidationOverViewBatchWiseDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            object? param = new {Action= "Save", contactEmailValidationOverView.ContactEmailValidationOverViewId, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            object? param = new { Action = "Update", contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetInProgress()
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            object? param = new { Action = "GetInProgress" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails()
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            List<string> paramName = new List<string> { };
            object? param = new { Action = "GetFinishedDetails" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedStatusDetails()
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            object? param = new { Action = "GetFinishedStatusDetails" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<Int32> CheckingForPendingStatus(int ContactEmailValidationOverViewId)
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails"; 
            object? param = new { Action = "CheckForPendingStatus", ContactEmailValidationOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFileDetails(int ContactEmailValidationOverViewId)
        {
            string storeProcCommand = "ContactEmailValidationOverView_BatchWiseDetails";
            object? param = new { Action = "GetFileDetails", ContactEmailValidationOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
