using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLStageReportsPG : CommonDataBaseInteraction, IDLStageReports
    {
        CommonInfo connection = null;
        public DLStageReportsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLStageReportsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, List<int> UseridList, bool IsCreatedDate)
        {
            string storeProcCommand = "select * from lms_stage_report_maxcount(@FromDate, @ToDate, @UseridList,@IsCreatedDate)";
            object? param = new { FromDate, ToDate, UseridList = string.Join(",", UseridList), IsCreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<DataSet> GetReport(DateTime FromDate, DateTime ToDate, int Offset, int FetchNext, List<int> UseridList, bool IsCreatedDate)
        {
            string storeProcCommand = "select * from lms_stage_report_getreport(@FromDate, @ToDate, @Offset, @FetchNext, @UseridList,@IsCreatedDate)";
            object? param = new { FromDate, ToDate, Offset, FetchNext, UseridList = string.Join(",", UseridList), IsCreatedDate };

            using var db = GetDbConnection(connection.Connection);
            string? queryString = await db.ExecuteScalarAsync<string>(storeProcCommand, param);

            var list = await db.ExecuteReaderAsync(queryString);
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
                    connection = null;
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
