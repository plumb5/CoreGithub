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
    public class DLShareReportPG : CommonDataBaseInteraction, IDLShareReport
    {
        CommonInfo connection;
        private bool _disposed = false;
        public DLShareReportPG(int AccountId)
        {
            connection = GetDBConnection();
        }
        /// <summary>
        /// //Share
        /// </summary>
        /// <param name="disposing"></param>
        public async Task<object>   Select_EmailId_AutoSuggest(MLShareReport mlObj)
        {
            
                var storeProcCommand = "select * from selectuseremailid(@AccountId,@SearchText)";
                object? param = new { mlObj.AccountId, mlObj.SearchText };
                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
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
