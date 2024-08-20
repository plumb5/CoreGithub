using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLMailAutheinticationSQL : CommonDataBaseInteraction, IDisposable, IDLMailAutheintication
    {
        CommonInfo connection = null;
        public DLMailAutheinticationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailAutheinticationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> UPDATE(MLMailAutheintication Data)
        {
            string storeProcCommand = "MailAutheintication";
            object? param = new { Action = "UPDATE", Data.Domain, Data.SPF, Data.MX, Data.Id, Data.Verify, Data.DMKI };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MLMailAutheintication>> GET(MLMailAutheintication Data)
        {
            string storeProcCommand = "MailAutheintication";
            object? param = new { Action = "GET", Data.Domain, Data.Id };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailAutheintication>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public List<MLMailAutheintication> GETDATA(MLMailAutheintication Data)
        {
            string storeProcCommand = "MailAutheintication";
            object? param = new { Action = "GET", Data.Domain, Data.Id };

            using var db = GetDbConnection(connection.Connection);
            return db.Query<MLMailAutheintication>(storeProcCommand, param, commandType: CommandType.StoredProcedure).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "MailAutheintication";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MLMailAutheintication?> GetDetails(int Id)
        {
            string storeProcCommand = "MailAutheintication";
            object? param = new { Action = "GetDetails", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMailAutheintication?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
