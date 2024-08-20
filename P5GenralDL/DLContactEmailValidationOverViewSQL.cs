using Azure.Core;
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
    public class DLContactEmailValidationOverViewSQL : CommonDataBaseInteraction, IDLContactEmailValidationOverView
    {
        CommonInfo connection = null;
        public DLContactEmailValidationOverViewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactEmailValidationOverViewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactEmailValidationOverView contactEmailValidationOverView)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action= "Save",contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.GroupUniqueCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ContactEmailValidationOverView contactEmailValidationOverView)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "Update", contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.GroupUniqueCount, contactEmailValidationOverView.ErrorMessage };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>1;
        }

        public async Task<Int32> GetMaxCount(int GroupId, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";

            object? param = new { Action = "GetMaxCount", GroupId, GroupName, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<IEnumerable<MLGroupEmailValidationOverView>> GetReportDetails(int GroupId, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "GetReportDetails", GroupId, GroupName, OffSet, FetchNext, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLGroupEmailValidationOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContactEmailValidationOverView>> GetNeedToStartList()
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "GetNeedToStartList" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContactEmailValidationOverView>> GetInProgress()
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "GetInProgress" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<bool> UpdateContactEmailValidation(DataTable dt)
        {
            string storeProcCommand = "Contact_EmailVerificationUpdate";

            object? param = new { Action = "UpdateContactEmailValidation", dt };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> GetGroupCountSentForValidation(int Id)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "GetGroupCountSentForValidation", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateStatus(int Id, string Status)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";

            object? param = new { Action = "UpdateStatus", Id, Status };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Contact_EmailValidationOverView";
            object? param = new { Action = "GetConsumptionCount", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
