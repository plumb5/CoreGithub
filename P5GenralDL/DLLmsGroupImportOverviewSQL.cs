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
    public class DLLmsGroupImportOverviewSQL : CommonDataBaseInteraction, IDLLmsGroupImportOverview
    {
        readonly CommonInfo connection;

        public DLLmsGroupImportOverviewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsGroupImportOverviewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsGroupImportOverview groupImportOverview)
        {
            string storeProcCommand = "LmsGroup_ImportOverview";
            object? param = new { Action= "Save", groupImportOverview.ContactImportOverviewId, groupImportOverview.LmsGroupId, groupImportOverview.SuccessCount, groupImportOverview.RejectedCount, groupImportOverview.ContactErrorRejectedCount };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<IEnumerable<LmsGroupImportOverview>> GetList(LmsGroupImportOverview groupImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "LmsGroup_ImportOverview";

            object? param = new { Action = "GetList", groupImportOverview.ContactImportOverviewId, groupImportOverview.LmsGroupId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LmsGroupImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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