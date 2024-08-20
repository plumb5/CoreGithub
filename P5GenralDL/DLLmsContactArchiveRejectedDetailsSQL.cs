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
    internal class DLLmsContactArchiveRejectedDetailsSQL : CommonDataBaseInteraction, IDLLmsContactArchiveRejectedDetails
    {
        CommonInfo connection;
        public DLLmsContactArchiveRejectedDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactArchiveRejectedDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<bool> SaveBulkLmsContactRejectedDetails(DataTable lmsreportdetails)
        {
            string storeProcCommand = "LmsContactArchive_RejectedDetails";
            object? param = new { Action = "Save", lmsreportdetails };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }

        public async Task<int> GetMaxCount(int LmsContactRemoveOverViewId)
        {
            string storeProcCommand = "LmsContactArchive_RejectedDetails";
            object? param = new { Action = "GetMaxCount", LmsContactRemoveOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<LmsContactArchiveRejectedDetails>> GetList(int LmsContactRemoveOverViewId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "LmsContactArchive_RejectedDetails";
            object? param = new { Action = "GetList", OffSet, FetchNext, LmsContactRemoveOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactArchiveRejectedDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method

    }
}
