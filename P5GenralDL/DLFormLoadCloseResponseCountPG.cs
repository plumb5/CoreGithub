using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFormLoadCloseResponseCountPG : CommonDataBaseInteraction, IDLFormLoadCloseResponseCount
    {
        CommonInfo connection = null;
        public DLFormLoadCloseResponseCountPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLFormLoadCloseResponseCountPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async void SaveUpdateForImpression(int FormId)
        {
            string storeProcCommand = "select form_loadcloseresponsecount_saveupdateforimpression(@FormId)";
             
            object? param = new { FormId }; 
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async void UpdateFormResponse(int FormId)
        {
            string storeProcCommand = "select form_loadcloseresponsecount_updateformresponse(@FormId)";
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async void UpdateFormClose(int FormId)
        {
            string storeProcCommand = "select form_loadcloseresponsecount_updateformclose(@FormId)";
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async Task<IEnumerable<FormLoadCloseResponseCount>>   GET(int FormId, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from form_loadcloseresponsecount_get(@FormId, @FromDateTime, @ToDateTime )";
             
            object? param = new { FormId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<FormLoadCloseResponseCount>(storeProcCommand, param);
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
