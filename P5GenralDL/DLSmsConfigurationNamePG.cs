using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;

namespace P5GenralDL
{
    public class DLSmsConfigurationNamePG : CommonDataBaseInteraction, IDLSmsConfigurationName
    {
        CommonInfo connection;

        public DLSmsConfigurationNamePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsConfigurationNamePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLSmsConfiguration>> GetConfigurationNames()
        {
            string storeProcCommand = "select * from sms_configurationname_get()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand)).ToList();
        }

        public async Task<List<MLSmsConfiguration>> GetConfigurationNameList()
        {
            string storeProcCommand = "select * from sms_configurationname_getconfigurationname()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand)).ToList();
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
