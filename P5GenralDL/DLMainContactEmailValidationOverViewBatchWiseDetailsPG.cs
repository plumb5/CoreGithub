using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMainContactEmailValidationOverViewBatchWiseDetailsPG : CommonDataBaseInteraction, IDLMainContactEmailValidationOverViewBatchWiseDetails
    {
        CommonInfo connection = null;
        public DLMainContactEmailValidationOverViewBatchWiseDetailsPG()
        {
            connection = GetDBConnection();
        }

        public DLMainContactEmailValidationOverViewBatchWiseDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "select  maincontactemailvalidationoverview_batchwisedetails_save(@Id, @ContactEmailValidationOverViewId, @GroupId, @File_Id, @File_Name, @Status, @Unique_Emails, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec, @AccountId)"; 
            object? param = new { contactEmailValidationOverView.Id, contactEmailValidationOverView.ContactEmailValidationOverViewId, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> Update(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "select maincontactemailvalidationoverview_batchwisedetails_update(@Id, @GroupId, @File_Id, @File_Name, @Status, @Unique_Emails, @Updated_At, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec)";
            object? param = new { contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool> UpdateStatus(string file_id)
        {
            string storeProcCommand = "select maincontactemailvalidationoverview_batchwisedetails_updatests(@file_id)";
            
            object? param = new { file_id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }
        public async Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetInProgress(string File_Id)
        {
            string storeProcCommand = "select * from maincontactemailvalidationoverview_batchdetails_getfileready(@File_Id)";
             
            object? param = new { File_Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails()
        {
            string storeProcCommand = "select * from contactemailvalidationoverview_batchwisedetails_getfinisheddetails()";
             
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand);
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
