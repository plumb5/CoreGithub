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
    public class DLContactDeduplicateOverviewSQL : CommonDataBaseInteraction, IDLContactDeduplicateOverview
    {
        readonly CommonInfo connection;

        public DLContactDeduplicateOverviewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactDeduplicateOverviewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action= "MaxCount", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<ContactDeDuplicateOverView>> GetDetails(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action = "GetDetails",OffSet, FetchNext, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactDeDuplicateOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ContactDeDuplicateOverView>> GetContactDeduplicateOverviewDetail()
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new {Action= "GetDetailsToVerify" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ContactDeDuplicateOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetVerifiedExistingContactData(DataTable dt)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action = "GetVerifiedData", dt };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> GetVerifiedUniqueContactData()
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action = "GetVerifiedData" };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        
        public async Task<bool> Update(ContactDeDuplicateOverView contactdeduplicateImportOverview)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new
            {
                Action="Update",
                contactdeduplicateImportOverview.Id,
                contactdeduplicateImportOverview.IsCompleted,
                contactdeduplicateImportOverview.TotalCounts,
                contactdeduplicateImportOverview.TotalCompleted,
                contactdeduplicateImportOverview.ExistingCounts,
                contactdeduplicateImportOverview.UniqueCounts,
                contactdeduplicateImportOverview.DuplicateCounts,
                contactdeduplicateImportOverview.ExistingFileContent,
                contactdeduplicateImportOverview.UniqueFileContent,
                contactdeduplicateImportOverview.DuplicateFileContent,
                contactdeduplicateImportOverview.ErrorMessage
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<ContactDeDuplicateOverView?> GetFileContentToDownload(int Id, string ContactFileType)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action= "GetFileContentToDownload",Id, ContactFileType };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactDeDuplicateOverView?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<Int32> Save(int UserInfoUserId, string ImportedFileName, byte[] ImportedFileBinaryData)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action = "Save", UserInfoUserId, ImportedFileName, ImportedFileBinaryData };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<ContactDeDuplicateOverView?> Get(ContactDeDuplicateOverView contactdeduplicateImportOverview)
        {
            string storeProcCommand = "ContactDeduplicate_Overview";
            object? param = new { Action = "Get", contactdeduplicateImportOverview.Id, contactdeduplicateImportOverview.IsCompleted };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactDeDuplicateOverView?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
