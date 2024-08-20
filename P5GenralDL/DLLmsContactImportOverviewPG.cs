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
    public class DLLmsContactImportOverviewPG : CommonDataBaseInteraction, IDLLmsContactImportOverview
    {
        CommonInfo connection;
        public DLLmsContactImportOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactImportOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Action,@UserInfoUserId, @LmsGroupId, @UserGroupId, @ContactFileName, @SuccessCount, @RejectedCount, @MergeCount, @IsCompleted, @ErrorMessage, @ImportedFileName, @TotalInputRow, @TotalCompletedRow, @AssignUserInfoUserId)";
            object? param = new { Action = "Save", contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.UserGroupId, contactImportOverview.ContactFileName, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.IsCompleted, contactImportOverview.ErrorMessage, contactImportOverview.ImportedFileName, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.AssignUserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Action,@Id, @SuccessCount, @RejectedCount, @MergeCount, @ErrorMessage, @IsCompleted, @TotalInputRow, @TotalCompletedRow)";
            object? param = new { Action = "Update", contactImportOverview.Id, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.ErrorMessage, contactImportOverview.IsCompleted, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<LmsContactImportOverview?> Get(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Type,@Id, @UserInfoUserId, @LmsGroupId, @IsCompleted )";
            object? param = new { Action = "Get", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.IsCompleted };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LmsContactImportOverview?>(storeProcCommand, param);

        }

        public async Task<List<LmsContactImportOverview>> GetList(LmsContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Type, @Id, @UserInfoUserId, @LmsGroupId, @IsCompleted, FromDateTime, ToDateTime)";
            object? param = new { Action = "GetList", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.IsCompleted, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<List<LmsContactImportOverview>> GetDetailsToImport()
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Action)";
            object? param = new { Action = "GetDetailsToImport" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<List<LmsContactImportOverview>> GetAllDetails(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Action, @OffSet, @FetchNext)";
            object? param = new { Action = "GetAllDetails", OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<int> GetAllDetailsMaxCount()
        {
            string storeProcCommand = "select * from LmsContact_ImportOverview(@Action)";
            object? param = new { Action = "GetAllDetailsCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
    }
}
