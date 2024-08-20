using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLSmsDLTConfigurationSQL : CommonDataBaseInteraction, IDLSmsDLTConfiguration
    {
        CommonInfo connection;

        public DLSmsDLTConfigurationSQL()
        {
            connection = GetDBConnection();
        }

        public DLSmsDLTConfigurationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<SmsDLTConfiguration?> GetOperatorData(string OperatorName)
        {
            string storeProcCommand = "SmsDLT_Configuration";
            object? param = new { @Action = "GetOperatorData", OperatorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsDLTConfiguration?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<SmsDLTConfiguration>> GetList()
        {
            string storeProcCommand = "SmsDLT_Configuration";
            object? param = new { @Action = "GetList" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsDLTConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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

