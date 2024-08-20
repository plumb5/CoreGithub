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
using static System.Net.Mime.MediaTypeNames;

namespace P5GenralDL
{
    public class DLContactEmailValidationOverViewPG : CommonDataBaseInteraction, IDLContactEmailValidationOverView
    {
        CommonInfo connection = null;
        public DLContactEmailValidationOverViewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactEmailValidationOverViewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

       

        public async Task<Int32> Save(ContactEmailValidationOverView contactEmailValidationOverView)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_save(@GroupId,@Iscompleted,@Errormessage,@Createddate,@Servernode, @File_Id, @File_Name, @Status, @Unique_Emails, @Updated_At, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec,@Updateddate, @GroupUniqueCount)";
            object? param = new { contactEmailValidationOverView.GroupId, contactEmailValidationOverView.IsCompleted, contactEmailValidationOverView.ErrorMessage, contactEmailValidationOverView.CreatedDate, contactEmailValidationOverView.ServerNode, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.UpdatedDate, contactEmailValidationOverView.GroupUniqueCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(ContactEmailValidationOverView contactEmailValidationOverView)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_update(@Id, @GroupId, @File_Id, @File_Name, @Status, @Unique_Emails, @Updated_At, @Percent, @Verified, @Unverified, @Ok, @Catch_All, @Disposable, @Invalid, @Unknown, @Reverify, @Estimated_Time_Sec, @GroupUniqueCount, @ErrorMessage )";
            object? param = new { contactEmailValidationOverView.Id, contactEmailValidationOverView.GroupId, contactEmailValidationOverView.File_Id, contactEmailValidationOverView.File_Name, contactEmailValidationOverView.Status, contactEmailValidationOverView.Unique_Emails, contactEmailValidationOverView.Updated_At, contactEmailValidationOverView.Percent, contactEmailValidationOverView.Verified, contactEmailValidationOverView.Unverified, contactEmailValidationOverView.Ok, contactEmailValidationOverView.Catch_All, contactEmailValidationOverView.Disposable, contactEmailValidationOverView.Invalid, contactEmailValidationOverView.Unknown, contactEmailValidationOverView.Reverify, contactEmailValidationOverView.Estimated_Time_Sec, contactEmailValidationOverView.GroupUniqueCount, contactEmailValidationOverView.ErrorMessage };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> GetMaxCount(int GroupId, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_maxcount(@GroupId, @GroupName, @FromDateTime, @ToDateTime)";

            object? param = new { GroupId, GroupName, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<IEnumerable<MLGroupEmailValidationOverView>> GetReportDetails(int GroupId, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_get(@GroupId, @GroupName, @OffSet, @FetchNext, @FromDateTime, @ToDateTime)";
            object? param = new { GroupId, GroupName, OffSet, FetchNext, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLGroupEmailValidationOverView>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ContactEmailValidationOverView>> GetNeedToStartList()
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_getneedtostartlist()";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverView>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ContactEmailValidationOverView>> GetInProgress()
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_getinprogress()";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactEmailValidationOverView>(storeProcCommand, param);
        }


        public async Task<bool> UpdateContactEmailValidation(DataTable dt)
        {
            string storeProcCommand = "select * from contact_emailverificationupdate_updatecontactemailvalidation(@dt)";

            object? param = new { dt };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> GetGroupCountSentForValidation(int Id)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_getgroupcountsentforvalidation(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> UpdateStatus(int Id, string Status)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_updatestatus(@Id, @Status)";

            object? param = new { Id, Status };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from contact_emailvalidationoverview_getconsumptioncount(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
