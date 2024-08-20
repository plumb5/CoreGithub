using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFormLoadCloseResponseCountSQL : CommonDataBaseInteraction, IDLFormLoadCloseResponseCount
    {
        CommonInfo connection = null;
        public DLFormLoadCloseResponseCountSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLFormLoadCloseResponseCountSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async void SaveUpdateForImpression(int FormId)
        {
            string storeProcCommand = "Form_LoadCloseResponseCount";

            object? param = new { Action = "SaveUpdateForImpression", FormId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async void UpdateFormResponse(int FormId)
        {
            string storeProcCommand = "Form_LoadCloseResponseCount";
            object? param = new { Action = "UpdateFormResponse", FormId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async void UpdateFormClose(int FormId)
        {
            string storeProcCommand = "Form_LoadCloseResponseCount";
            object? param = new { Action = "UpdateFormClose", FormId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
        }

        public async Task<IEnumerable<FormLoadCloseResponseCount>> GET(int FormId, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_LoadCloseResponseCount";

            object? param = new { Action = "Get", FormId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormLoadCloseResponseCount>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
