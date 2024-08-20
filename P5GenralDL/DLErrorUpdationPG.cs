using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLErrorUpdationPG : CommonDataBaseInteraction, IDLErrorUpdation
    {
        CommonInfo connection;
        public DLErrorUpdationPG()
        {
            connection = GetDBConnection();
        }

        public DLErrorUpdationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> SaveLog(MLErrorUpdation mLErrorUpdation)
        {
            string storeProcCommand = "select * from error_updation_savelog(@LogName, @Error, @ErrorDescription, @PageName, @StackTrace)";
            object? param = new { mLErrorUpdation.LogName, mLErrorUpdation.Error, mLErrorUpdation.ErrorDescription, mLErrorUpdation.PageName, mLErrorUpdation.StackTrace };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLErrorUpdation>> GetLog(MLErrorUpdation mLErrorUpdation, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from error_updation_getlog(@Id, @LogName, OffSet, FetchNext )";
            object? param = new { mLErrorUpdation.Id, mLErrorUpdation.LogName, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLErrorUpdation>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLErrorUpdation>> GetErrorLog(string errorName, DateTime fromDateTime, DateTime toDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from error_updation_getlogs(@errorName, @fromDateTime, @toDateTime, @OffSet, @FetchNext )";
            object? param = new { errorName, fromDateTime, toDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLErrorUpdation>(storeProcCommand, param)).ToList();

        }
        public async Task<int> GetErrorMaxCount(string ErrorName, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from error_updation_getmaxcount(@ErrorName, @FromDateTime, @ToDateTime)";
            object? param = new { ErrorName, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
