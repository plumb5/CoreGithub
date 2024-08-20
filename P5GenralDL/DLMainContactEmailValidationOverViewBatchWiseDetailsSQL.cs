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
    public class DLMainContactEmailValidationOverViewBatchWiseDetailsSQL : CommonDataBaseInteraction, IDLMainContactEmailValidationOverViewBatchWiseDetails
    {
        CommonInfo connection = null;
        public DLMainContactEmailValidationOverViewBatchWiseDetailsSQL()
        {
            connection = GetDBConnection();
        }

        public DLMainContactEmailValidationOverViewBatchWiseDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "MainContactEmailValidationOverview_BatchDetails";
            object? param = new {Action= "Save", contactEmailValidationOverView.Id, contactEmailValidationOverView.ContactEmailValidationOverViewId, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> Update(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "MainContactEmailValidationOverview_BatchDetails";
            object? param = new { Action = "Update", contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> UpdateStatus(string file_id)
        {
            string storeProcCommand = "MainContactEmailValidationOverview_BatchDetails";

            object? param = new { Action = "UpdateStatus", file_id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }
        public async Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetInProgress(string File_Id)
        {
            string storeProcCommand = "MainContactEmailValidationOverview_BatchDetails";

            object? param = new { Action = "GetFileReady", File_Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails()
        {
            string storeProcCommand = "MainContactEmailValidationOverview_BatchDetails";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
