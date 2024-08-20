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
    public class DLLmsGroupImportOverviewPG : CommonDataBaseInteraction, IDLLmsGroupImportOverview
    {
        readonly CommonInfo connection;

        public DLLmsGroupImportOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsGroupImportOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsGroupImportOverview groupImportOverview)
        {
            string storeProcCommand = "select lmsgroup_importoverview_save(@ContactImportOverviewId, @LmsGroupId, @SuccessCount, @RejectedCount, @ContactErrorRejectedCount)";
            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.LmsGroupId, groupImportOverview.SuccessCount, groupImportOverview.RejectedCount, groupImportOverview.ContactErrorRejectedCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }


        public async Task<IEnumerable<LmsGroupImportOverview>>GetList(LmsGroupImportOverview groupImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "select * from lmsgroup_importoverview_getlist(@ContactImportOverviewId, @LmsGroupId,@FromDateTime,@ToDateTime)";

            object? param = new { groupImportOverview.ContactImportOverviewId, groupImportOverview.LmsGroupId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LmsGroupImportOverview>(storeProcCommand, param);
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
