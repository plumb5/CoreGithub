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
    public class DLGroupImportOverviewPG : CommonDataBaseInteraction, IDLGroupImportOverview
    {
        readonly CommonInfo connection;

        public DLGroupImportOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupImportOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(GroupImportOverview groupImportOverview)
        {
            string storeProcCommand = "select group_importoverview_save(@ContactImportOverviewId, @GroupId, @SuccessCount, @RejectedCount, @ContactErrorRejectedCount)";
            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.GroupId, groupImportOverview.SuccessCount, groupImportOverview.RejectedCount, groupImportOverview.ContactErrorRejectedCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(GroupImportOverview groupImportOverview)
        {
            string storeProcCommand = "select group_importoverview_update(@ContactImportOverviewId, @GroupId, @SuccessCount, @RejectedCount, @ContactErrorRejectedCount)";
            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.GroupId, groupImportOverview.SuccessCount, groupImportOverview.RejectedCount, groupImportOverview.ContactErrorRejectedCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<GroupImportOverview?> Get(GroupImportOverview groupImportOverview)
        {
            string storeProcCommand = "select * from group_importoverview_get(@ContactImportOverviewId, @GroupId)";
            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<GroupImportOverview?>(storeProcCommand, param);
        }

        public async Task<List<GroupImportOverview>> GetList(GroupImportOverview groupImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from group_importoverview_getlist(@ContactImportOverviewId, @GroupId, @FromDateTime, @ToDateTime)";
            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.GroupId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupImportOverview>(storeProcCommand, param)).ToList();
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
