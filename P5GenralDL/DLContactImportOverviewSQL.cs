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
    internal class DLContactImportOverviewSQL : CommonDataBaseInteraction, IDLContactImportOverview
    {
        CommonInfo connection;
        public DLContactImportOverviewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<int> Save(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "Save", contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.UserGroupId, contactImportOverview.ContactFileName, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.IsCompleted, contactImportOverview.ErrorMessage, contactImportOverview.ImportSource, contactImportOverview.AssociateContactsToGroup, contactImportOverview.GroupAddSuccessCount, contactImportOverview.GroupAddRejectCount, contactImportOverview.ImportedFileName, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.LmsGroupId, contactImportOverview.OverrideAssignment, contactImportOverview.UserIdList, contactImportOverview.OverrideSources, contactImportOverview.NotoptedforEmailValidation, contactImportOverview.IgnoreUpdateContact };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "Update", contactImportOverview.Id, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.ErrorMessage, contactImportOverview.IsCompleted, contactImportOverview.GroupAddSuccessCount, contactImportOverview.GroupAddRejectCount, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.LmsGroupAddSuccessCount, contactImportOverview.LmsGroupAddRejectCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<ContactImportOverview?> Get(ContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "Get", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.IsCompleted };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<ContactImportOverview>> GetList(ContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "GetList", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.GroupId, contactImportOverview.IsCompleted, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<ContactImportOverview?> GetDetailsToImport()
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "GetRunningDetails" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<ContactImportOverview>> GetAllDetails(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "GetAllDetails", OffSet, FetchNext, FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> GetAllDetailsMaxCount(DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "GetAllDetailsCount", FromDateTime, ToDateTime, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<ContactImportOverview?> GetRunningDetails()
        {
            string storeProcCommand = "Contact_ImportOverview";
            object? param = new { Action = "GetRunningDetails" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactImportOverview?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
