using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;

namespace P5GenralDL
{
    public class DLMailAutheinticationPG : CommonDataBaseInteraction, IDisposable, IDLMailAutheintication
    {
        CommonInfo connection = null;
        public DLMailAutheinticationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailAutheinticationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<bool> UPDATE(MLMailAutheintication Data)
        {
            string storeProcCommand = "select mailautheintication_update(@Domain,@SPF,@MX,@Id,@Verify,@DMKI)";
            object? param = new { Data.Domain, Data.SPF, Data.MX, Data.Id, Data.Verify, Data.DMKI };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLMailAutheintication>> GET(MLMailAutheintication Data)
        {
            string storeProcCommand = "select * from mailautheintication_get(@Domain,@Id)";
            object? param = new { Data.Domain, Data.Id };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailAutheintication>(storeProcCommand, param)).ToList();
        }

        public List<MLMailAutheintication> GETDATA(MLMailAutheintication Data)
        {
            string storeProcCommand = "select * from mailautheintication_get(@Domain,@Id)";
            object? param = new { Data.Domain, Data.Id };

            using var db = GetDbConnection(connection.Connection);
            return (db.Query<MLMailAutheintication>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mailautheintication_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MLMailAutheintication?> GetDetails(int Id)
        {
            string storeProcCommand = "select * from mailautheintication_getdetails(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMailAutheintication?>(storeProcCommand, param);

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
