using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;


namespace P5GenralDL
{
    public class DLP5BulkServicesPG : CommonDataBaseInteraction, IDLP5BulkServices
    {
        CommonInfo connection;
        public DLP5BulkServicesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLP5BulkServicesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DataSet> GetBulkServices(string Channel)
        {
            string storeProcCommand = "select * from get_bulk_services(@Action)";
            object? param = new { Channel };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetBulkServicesDateTime(string Channel, int SendingSettingId)
        {
            string storeProcCommand = "select * from get_date_senttable(@Action,@Sendingsettingid)";
            object? param = new { Channel, SendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
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