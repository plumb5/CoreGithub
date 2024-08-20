using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLP5BulkServicesSQL : CommonDataBaseInteraction, IDLP5BulkServices
    {
        CommonInfo connection;
        public DLP5BulkServicesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLP5BulkServicesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DataSet> GetBulkServices(string Channel)
        {
            string storeProcCommand = "BulkChannel_Services";
            object? param = new { @Action = "GetBulkService", Channel };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetBulkServicesDateTime(string Channel, int SendingSettingId)
        {
            string storeProcCommand = "BulkChannel_Services";
            object? param = new { @Action = "GetDateSentTable", Channel, SendingSettingId };

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
