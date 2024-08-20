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
    public class DLMainTrackerSQL : CommonDataBaseInteraction, IDLMainTracker
    {
        CommonInfo connection;
        public DLMainTrackerSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLMainTrackerSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<DataSet> GetAnalyticsTrackingStatus()
        {
            string storeProcCommand = "GetAnalyticsDateTime";
            object? param = new { };
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
