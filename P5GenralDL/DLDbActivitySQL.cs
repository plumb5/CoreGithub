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
    public class DLDbActivitySQL : CommonDataBaseInteraction, IDLDbActivity
    {
        CommonInfo connection;
        public DLDbActivitySQL()
        {
            connection = GetDBConnection();
        }

        public DLDbActivitySQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<int> DbActivitymaxCount(string TimeInterval)
        {
            string storeProcCommand = "DbActivity";
            object? param = new {Action= "GetCount", TimeInterval };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<DataSet> DbActivityReport(int OffSet, int FetchNext, string TimeInterval, string query = null)
        {
            string storeProcCommand = "GetData";
            object? param = new { Action = "GetCount", OffSet, FetchNext, TimeInterval, query };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<bool> DbActivityDeleteRecords(int Pid)
        {
            string storeProcCommand = "DbActivity";
            object? param = new { Action = "Delete", Pid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public Task<DataSet> GetDBActivityTriggerMail(string TimeInterval)
        {
            throw new NotImplementedException();
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
