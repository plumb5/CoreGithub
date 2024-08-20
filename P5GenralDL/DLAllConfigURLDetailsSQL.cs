using Dapper;
using DBInteraction;
using P5GenralML;
using System.Data;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLAllConfigURLDetailsSQL : CommonDataBaseInteraction, IDLAllConfigURLDetails
    {
        CommonInfo connection;

        public DLAllConfigURLDetailsSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<List<AllConfigURL>> Get()
        {
            string storeProcCommand = "All_Configurl";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<AllConfigURL>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Int32> Save(AllConfigURL allConfigURL)
        {
            string storeProcCommand = "All_Configurl";
            object? param = new { Action = "Save", allConfigURL.KeyName, allConfigURL.KeyValue };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
