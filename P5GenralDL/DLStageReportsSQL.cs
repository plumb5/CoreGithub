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
    public class DLStageReportsSQL : CommonDataBaseInteraction, IDLStageReports
    {
        CommonInfo connection = null;
        public DLStageReportsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLStageReportsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, List<int> UseridList, bool IsCreatedDate)
        {
            string storeProcCommand = "Lms_Stage_Report";
            object? param = new { Action= "MaxCount", FromDate, ToDate, UseridList = String.Join(",", UseridList), IsCreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<DataSet> GetReport(DateTime FromDate, DateTime ToDate, int Offset, int FetchNext, List<int> UseridList, bool IsCreatedDate)
        {
            string storeProcCommand = "Lms_Stage_Report";
            object? param = new { Action = "GetReport", FromDate, ToDate, Offset, FetchNext, UseridList=String.Join(",", UseridList), IsCreatedDate };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
