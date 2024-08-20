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
    internal class DLShareReportSQL : CommonDataBaseInteraction, IDLShareReport
    {
        CommonInfo connection;
        private bool _disposed = false;
        public DLShareReportSQL(int AccountId)
        {
            connection = GetDBConnection();
        }
        /// <summary>
        /// //Share
        /// </summary>
        /// <param name="disposing"></param>
        public async Task<object> Select_EmailId_AutoSuggest(MLShareReport mlObj)
        {

            var storeProcCommand = "SelectUserEmailId";
            object? param = new { mlObj.AccountId, mlObj.SearchText };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;


        }
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
    }
}
