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
    public class DLEventImportOverviewPG : CommonDataBaseInteraction, IDLEventImportOverview
    {
        CommonInfo connection;
        public DLEventImportOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLEventImportOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(EventImportOverview eventImportOverview)
        {
            string storeProcCommand = "select * from CustomEvent_ImportOverview(@Action, @UserInfoUserId, @UserGroupId, @EventFileName, @SuccessCount, @RejectedCount, @IsCompleted, @ErrorMessage, @ImportSource, @ImportedFileName, @TotalInputRow, @TotalCompletedRow )";
            object? param = new { Action = "Save", eventImportOverview.UserInfoUserId, eventImportOverview.UserGroupId, eventImportOverview.EventFileName, eventImportOverview.SuccessCount, eventImportOverview.RejectedCount, eventImportOverview.IsCompleted, eventImportOverview.ErrorMessage, eventImportOverview.ImportSource, eventImportOverview.ImportedFileName, eventImportOverview.TotalInputRow, eventImportOverview.TotalCompletedRow };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(EventImportOverview eventImportOverview)
        {
            string storeProcCommand = "select * from customevent_importoverview_update(@Id, @SuccessCount, @RejectedCount, @ErrorMessage, @IsCompleted, @TotalInputRow, @TotalCompletedRow )";
            object? param = new { eventImportOverview.Id, eventImportOverview.SuccessCount, eventImportOverview.RejectedCount, eventImportOverview.ErrorMessage, eventImportOverview.IsCompleted, eventImportOverview.TotalInputRow, eventImportOverview.TotalCompletedRow };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<EventImportOverview?> GetRunningDetails()
        {
            string storeProcCommand = "select * from customevent_importoverview_getrunningdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<EventImportOverview?>(storeProcCommand, param);

        }

        public async Task<EventImportOverview?> GetDetailsToImport()
        {
            string storeProcCommand = "select * from customevent_importoverview_getdetailstoimport()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<EventImportOverview?>(storeProcCommand, param);

        }
    }
}
