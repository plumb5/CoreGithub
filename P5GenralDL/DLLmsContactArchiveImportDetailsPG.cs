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
    internal class DLLmsContactArchiveImportDetailsPG : CommonDataBaseInteraction, IDLLmsContactArchiveImportDetails
    {
        CommonInfo connection;
        public DLLmsContactArchiveImportDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactArchiveImportDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> SaveBulkLmsContactImportDetails(DataTable lmsimportdetails)
        {
            string storeProcCommand = "select * from lmscontactarchive_importdetails_save(@lmsimportdetails)";
            object? param = new { lmsimportdetails };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<LmsContactArchiveDetails>> GetDetails(int LmsContactRemoveOverViewId, Int16 ArchivedStatus = 0)
        {
            string storeProcCommand = "select * from lmscontactarchive_importdetails_getdetails(@LmsContactRemoveOverViewId, @ArchivedStatus)";
            object? param = new { LmsContactRemoveOverViewId, ArchivedStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactArchiveDetails>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> Delete(int LmsContactRemoveOverViewId)
        {
            string storeProcCommand = "select * from lmscontactarchive_importdetails_delete(@LmsContactRemoveOverViewId)";
            object? param = new { LmsContactRemoveOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<IEnumerable<DataSet>> GetAllDetails(int LmsContactRemoveOverViewId)
        {
            string storeProcCommand = "select * from LmsContactArchive_ImportDetails(@Action,LmsContactRemoveOverViewId)";
            object? param = new { Action = "GetDetails", LmsContactRemoveOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<DataSet>(storeProcCommand, param);

        }

        public async Task<IEnumerable<DataSet>> GetCountDetails(int LmsContactRemoveOverViewId)
        {
            string storeProcCommand = "select * from lmscontactarchive_importdetails_getcountdetails(@LmsContactRemoveOverViewId)";
            object? param = new { LmsContactRemoveOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<DataSet>(storeProcCommand, param);

        }
    }
}