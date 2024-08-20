using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLP5SqlJobsErrorLogPG : CommonDataBaseInteraction, IDLP5SqlJobsErrorLog
    {
        CommonInfo connection;
        public DLP5SqlJobsErrorLogPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLP5SqlJobsErrorLogPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> SaveLog(P5SqlJobsErrorLog sqlJobsErrorLog)
        {
            string storeProcCommand = "select * from p5sqljobs_errorlog_savelog(@AccountId, @StoreProcedureName, @StartTime, @EndTime, @ErrorLog)";
            object? param = new { sqlJobsErrorLog.AccountId, sqlJobsErrorLog.StoreProcedureName, sqlJobsErrorLog.StartTime, sqlJobsErrorLog.EndTime, sqlJobsErrorLog.ErrorLog };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
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
