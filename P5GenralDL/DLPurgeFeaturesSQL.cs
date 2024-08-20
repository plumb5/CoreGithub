using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;
using System.Threading.Channels;

namespace P5GenralDL
{
    public class DLPurgeFeaturesSQL : CommonDataBaseInteraction, IDLPurgeFeatures
    {
        CommonInfo connection = null;
        public DLPurgeFeaturesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLPurgeFeaturesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Features>> GetFeaturesDetails()
        {
            string storeProcCommand = "GetForPurgeSettingsCounts";
            object? param = new { @Action = "GetCountsDetails" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Features>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


