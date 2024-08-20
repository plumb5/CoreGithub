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
    public class DLSearchedDataTagsSQL : CommonDataBaseInteraction, IDLSearchedDataTags
    {
        CommonInfo connection;
        public DLSearchedDataTagsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSearchedDataTagsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLSiteSearchPages>> GetSiteSearchPagesForExport(int OffSet, int FetchNext)
        {
            string storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "ExportSearchPage", OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSiteSearchPages>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSiteSearchTerm>> GetSiteSearchTermForExport(int OffSet, int FetchNext)
        {
            string storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "ExportSearchTerm", OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSiteSearchTerm>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Int32> IsDataExists()
        {
            string storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "IsDataExists" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<object> OverViewGraphDetails(DateTime FromDateTime, DateTime ToDateTime)
        {

            var storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "IsDataExists", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;


        }

        public async Task<object> TopSearchedPage(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "TopSearchedPage", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<object> TopSearchedTerm(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "TopSearchedTerm", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<object> GetSearchTerm(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "GetSearchTerm", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<object> GetSearchPage(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "Searched_DataTags";
            object? param = new { Action = "GetSearchPage", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

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
