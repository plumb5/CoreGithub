using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLLmsSourceTypeSQL : CommonDataBaseInteraction, IDLLmsSourceType
    {
        CommonInfo connection;
        public DLLmsSourceTypeSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsSourceTypeSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsSourceType LmsSourceType)
        {
            string storeProcCommand = "LmsSourceType";
            object? param = new { Action = "SaveUpdate", LmsSourceType.Type, LmsSourceType.CreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<Int32> Update(LmsSourceType LmsSourceType)
        {
            string storeProcCommand = "LmsSourceType";
            object? param = new { Action = "SaveUpdate", LmsSourceType.Id, LmsSourceType.Type, LmsSourceType.CreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<LmsSourceType>> GetLmsSorceType()
        {
            string storeProcCommand = "LmsSourceType";
            object? param = new { Action = "Get" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsSourceType>(storeProcCommand, commandType: CommandType.StoredProcedure)).ToList();
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
