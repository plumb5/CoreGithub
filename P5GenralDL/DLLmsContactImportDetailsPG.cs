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
    internal class DLLmsContactImportDetailsPG : CommonDataBaseInteraction, IDLLmsContactImportDetails
    {
        CommonInfo connection;
        public DLLmsContactImportDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactImportDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<bool> SaveBulkLmsContactImportDetails(DataTable lmsimportdetails)
        {
            string storeProcCommand = "select * from LmsContact_ImportDetails(@Action,@lmsimportdetails)";
            object? param = new { Action = "Save", lmsimportdetails };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<LmsContactImportDetails>> GetDetails(int LmsContactImportOverViewId)
        {
            string storeProcCommand = "select * from LmsContact_ImportDetails(@Action,@LmsContactImportOverViewId)";
            object? param = new { Action = "GetDetails", LmsContactImportOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportDetails>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> Delete(int LmsContactImportOverViewId)
        {
            string storeProcCommand = "select * from LmsContact_ImportDetails(@Action,@LmsContactImportOverViewId)";
            object? param = new { Action = "Delete", LmsContactImportOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<DataSet> GetAllDetails(int LmsContactImportOverViewId)
        {
            string storeProcCommand = "select * from LmsContact_ImportDetails(@Action,@LmsContactImportOverViewId)";
            object? param = new { Action = "GetDetails", LmsContactImportOverViewId };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetCountDetails(int LmsContactImportOverViewId)
        {
            string storeProcCommand = "select * from LmsContact_ImportDetails(@Action,@LmsContactImportOverViewId)";
            object? param = new { Action = "GetCountDetails", LmsContactImportOverViewId };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
    }
}
