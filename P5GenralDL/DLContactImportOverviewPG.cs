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
    public class DLContactImportOverviewPG : CommonDataBaseInteraction, IDLContactImportOverview
    {
        CommonInfo connection;
        public DLContactImportOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactImportOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> Save(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from contact_importoverview_save(@UserInfoUserId, @GroupId, @UserGroupId, @ContactFileName, @SuccessCount, @RejectedCount, @MergeCount, @IsCompleted, @ErrorMessage, @ImportSource, @AssociateContactsToGroup,  @GroupAddRejectCount, @ImportedFileName, @TotalInputRow, @TotalCompletedRow, @LmsGroupId, @OverrideAssignment, @UserIdList, @OverrideSources,@GroupAddSuccessCount, @NotoptedforEmailValidation, @IgnoreUpdateContact, @SourceType)";
            object? param = new { contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.UserGroupId, contactImportOverview.ContactFileName, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.IsCompleted, contactImportOverview.ErrorMessage, contactImportOverview.ImportSource, contactImportOverview.AssociateContactsToGroup, contactImportOverview.GroupAddRejectCount, contactImportOverview.ImportedFileName, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.LmsGroupId, contactImportOverview.OverrideAssignment, contactImportOverview.UserIdList, contactImportOverview.OverrideSources, contactImportOverview.GroupAddSuccessCount, contactImportOverview.NotoptedforEmailValidation, contactImportOverview.IgnoreUpdateContact, contactImportOverview.SourceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from contact_importoverview_update(@Id, @SuccessCount, @RejectedCount, @MergeCount, @ErrorMessage, @IsCompleted, @GroupAddSuccessCount, @GroupAddRejectCount, @TotalInputRow, @TotalCompletedRow, @LmsGroupAddSuccessCount, @LmsGroupAddRejectCount)";
            object? param = new { contactImportOverview.Id, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.ErrorMessage, contactImportOverview.IsCompleted, contactImportOverview.GroupAddSuccessCount, contactImportOverview.GroupAddRejectCount, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.LmsGroupAddSuccessCount, contactImportOverview.LmsGroupAddRejectCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<ContactImportOverview?> Get(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from contact_importoverview_get(@Id, @UserInfoUserId, @GroupId, @IsCompleted)";
            object? param = new { contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.IsCompleted };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param);

        }

        public async Task<List<ContactImportOverview>> GetList(ContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from Contact_ImportOverview(@Action,@Id, @UserInfoUserId, @GroupId, @IsCompleted, FromDateTime, ToDateTime)";
            object? param = new { Action = "GetList", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.IsCompleted, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactImportOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<ContactImportOverview?> GetDetailsToImport()
        {
            string storeProcCommand = "select * from contact_importoverview_getdetailstoimport()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param);

        }

        public async Task<List<ContactImportOverview>> GetAllDetails(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "select * from contact_importoverview_getalldetails(@OffSet, @FetchNext, @FromDateTime, @ToDateTime, @UserIdList)";
            object? param = new { OffSet, FetchNext, FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactImportOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<int> GetAllDetailsMaxCount(DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "select * from contact_importoverview_getalldetailscount(@FromDateTime, @ToDateTime, @UserIdList)";
            object? param = new { FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<ContactImportOverview?> GetRunningDetails()
        {
            string storeProcCommand = "select * from contact_importoverview_getrunningdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param);

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
