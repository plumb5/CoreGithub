using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLP5SqlJobsErrorLogSQL : CommonDataBaseInteraction, IDLP5SqlJobsErrorLog
    {
        CommonInfo connection;
        public DLP5SqlJobsErrorLogSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLP5SqlJobsErrorLogSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> SaveLog(P5SqlJobsErrorLog sqlJobsErrorLog)
        {
            string storeProcCommand = "P5SqlJobs_ErrorLog";
            object? param = new { @Action = "SaveLog", sqlJobsErrorLog.AccountId, sqlJobsErrorLog.StoreProcedureName, sqlJobsErrorLog.StartTime, sqlJobsErrorLog.EndTime, sqlJobsErrorLog.ErrorLog };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
