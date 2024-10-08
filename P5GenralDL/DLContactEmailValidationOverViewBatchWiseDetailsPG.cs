﻿using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;
using Azure.Core;
using System;


namespace P5GenralDL
{
    public class DLContactEmailValidationOverViewBatchWiseDetailsPG : CommonDataBaseInteraction, IDLContactEmailValidationOverViewBatchWiseDetails
    {
        CommonInfo connection = null;
        public DLContactEmailValidationOverViewBatchWiseDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactEmailValidationOverViewBatchWiseDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "select contactemailvalidationoverview_batchwisedetails_save(@ContactEmailValidationOverViewId, @GroupId, @File_Id, @File_Name, @Status, @Unique_Emails, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec )";
            object? param = new {contactEmailValidationOverView.ContactEmailValidationOverViewId, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView)
        {
            string storeProcCommand = "select contactemailvalidationoverview_batchwisedetails_update(@Id, @GroupId, @File_Id, @File_Name, @Status, @Unique_Emails, @Updated_At, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec)";
            object? param = new {contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>>  GetInProgress()
        {
            string storeProcCommand = "select * from contactemailvalidationoverview_batchwisedetails_getinprogress()"; 
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails()
        {
            string storeProcCommand = "select * from contactemailvalidationoverview_batchwisedetails_getfinisheddetails()";
            List<string> paramName = new List<string> { };
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedStatusDetails()
        { 
            string storeProcCommand = "select * from contactemailvalidationoverview_batchwisedetails_finishedstatus()";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param);
        }

        public async Task<Int32> CheckingForPendingStatus(int ContactEmailValidationOverViewId)
        {
            string storeProcCommand = "select contactemailvalidationoverview_batchwisedetails_checkforpending(@ContactEmailValidationOverViewId)";
            object? param = new { ContactEmailValidationOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFileDetails(int ContactEmailValidationOverViewId)
        {
            string storeProcCommand = "select * from contactemailvalidationoverview_batchwisedetails_getfiledetails(@ContactEmailValidationOverViewId)";
            object? param = new { ContactEmailValidationOverViewId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverViewBatchWiseDetails>(storeProcCommand, param);
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
