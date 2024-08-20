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
    public class DLDbActivityPG : CommonDataBaseInteraction, IDLDbActivity
    {
        CommonInfo connection;
        public DLDbActivityPG()
        {
            connection = GetDBConnection();
        }

        public DLDbActivityPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> DbActivitymaxCount(string TimeInterval)
        {
            string storeProcCommand = "select * from dbactivity_getmaxcount(@TimeInterval)";
            object? param = new { TimeInterval };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<DataSet> DbActivityReport(int OffSet, int FetchNext, string TimeInterval, string query = null)
        {
            string storeProcCommand = "select * from dbactivity_getreport(@OffSet, @FetchNext, @TimeInterval, @query)";
            object? param = new { OffSet, FetchNext, TimeInterval, query };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<bool> DbActivityDeleteRecords(int Pid)
        {
            string storeProcCommand = "select * from dbactivity_delete(@Pid)";
            object? param = new { Pid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<DataSet> GetDBActivityTriggerMail(string TimeInterval)
        {
            string storeProcCommand = "select * from dbactivity_getcputime(@TimeInterval)";
            object? param = new { TimeInterval };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
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
