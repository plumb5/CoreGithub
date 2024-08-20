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
    public class DLLmsSourceTypePG : CommonDataBaseInteraction, IDLLmsSourceType
    {
        CommonInfo connection;
        public DLLmsSourceTypePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsSourceTypePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsSourceType LmsSourceType)
        {
            string storeProcCommand = "select lmssourcetype_saveupdate(@Type,@CreatedDate)";
            object? param = new { LmsSourceType.Type, LmsSourceType.CreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<Int32> Update(LmsSourceType LmsSourceType)
        {
            string storeProcCommand = "select lmssourcetype_saveupdate(@Id,@Type,@CreatedDate)";
            object? param = new { LmsSourceType.Id, LmsSourceType.Type, LmsSourceType.CreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<List<LmsSourceType>> GetLmsSorceType()
        {
            string storeProcCommand = "select * from lmssourcetype_get()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsSourceType>(storeProcCommand)).ToList();
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
