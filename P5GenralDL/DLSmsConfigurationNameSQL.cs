using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLSmsConfigurationNameSQL : CommonDataBaseInteraction, IDLSmsConfigurationName
    {
        CommonInfo connection;

        public DLSmsConfigurationNameSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsConfigurationNameSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLSmsConfiguration>> GetConfigurationNames()
        {
            string storeProcCommand = "Sms_ConfigurationName";
            object? param = new { Action = "Get" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLSmsConfiguration>> GetConfigurationNameList()
        {
            string storeProcCommand = "Sms_ConfigurationName";
            object? param = new { Action = "GetConfigurationName" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
