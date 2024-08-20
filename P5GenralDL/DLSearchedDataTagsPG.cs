using Dapper;
using DBInteraction;
using IP5GenralDL;
using Org.BouncyCastle.Asn1;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSearchedDataTagsPG : CommonDataBaseInteraction, IDLSearchedDataTags
    {
        CommonInfo connection;
        public DLSearchedDataTagsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSearchedDataTagsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLSiteSearchPages>>  GetSiteSearchPagesForExport(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from searched_datatags_exportsearchpage(@OffSet, @FetchNext)";
            object? param = new { OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSiteSearchPages>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLSiteSearchTerm>>  GetSiteSearchTermForExport(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from searched_datatags_exportsearchterm(@OffSet, @FetchNext)";
            object? param = new { OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSiteSearchTerm>(storeProcCommand, param)).ToList();
        }
        
        public async Task<Int32> IsDataExists()
        {
            string storeProcCommand = "select searched_datatags_isdataexists()";
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
        }

        public async Task<object> OverViewGraphDetails(DateTime FromDateTime, DateTime ToDateTime)
        {

            var storeProcCommand = "select * from searched_datatags_overviewgraphdetails(@FromDateTime, @ToDateTime )";
            object? param = new { FromDateTime, ToDateTime }; 
            using var db = GetDbConnection(connection.Connection); 
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset; 

        }

        public async Task<object> TopSearchedPage(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "select * from  searched_datatags_topsearchedpage(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<object> TopSearchedTerm(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "select * from searched_datatags_topsearchedterm(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<object> GetSearchTerm(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "select * from searched_datatags_getsearchterm(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<object> GetSearchPage(DateTime FromDateTime, DateTime ToDateTime)
        {
            var storeProcCommand = "select * from searched_datatags_getsearchpage(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
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
