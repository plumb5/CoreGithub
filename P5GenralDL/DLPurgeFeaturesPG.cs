using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPurgeFeaturesPG : CommonDataBaseInteraction, IDLPurgeFeatures
    {
        CommonInfo connection = null;
        public DLPurgeFeaturesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLPurgeFeaturesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Features>> GetFeaturesDetails()
        {
            string storeProcCommand = "select * from getforpurgesettings_counts_and_earliest_date()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Features>(storeProcCommand)).ToList();
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


