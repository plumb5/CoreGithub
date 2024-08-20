using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLP5SqlJobsSQL : CommonDataBaseInteraction, IDLP5SqlJobs
    {
        CommonInfo connection = null;
        public DLP5SqlJobsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLP5SqlJobsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<P5SqlJobs>> GetJobsDetails(P5SqlJobs p5SqlJobs)
        {
            string storeProcCommand = "P5Sql_Jobs";
            object? param = new { @Action = "GetSqlJobsDetails", p5SqlJobs.Id };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<P5SqlJobs>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> UpdateStatus(P5SqlJobs p5SqlJobs)
        {
            string storeProcCommand = "P5Sql_Jobs";
            object? param = new { @Action = "GetSqlJobsDetailsList", p5SqlJobs.Id, p5SqlJobs.IsTimeIntervalCompleted, p5SqlJobs.LastExecuteDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ResetStatus(bool iscached)
        {
            string storeProcCommand = "P5Sql_Jobs";
            object? param = new { @Action = "ResetStatus", iscached };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateLastExecutedDate()
        {
            string storeProcCommand = "P5Sql_Jobs";
            object? param = new { @Action = "UpdateDateTime" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<P5SqlJobs?> GetRestartDetails()
        {
            string storeProcCommand = "P5Sql_Jobs";
            object? param = new { @Action = "GetRestartDetails" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<P5SqlJobs>(storeProcCommand);
        }

        public async Task<P5SqlJobsForAnalytics?> GetDetails(int AccountId, int p5sqljobsid)
        {
            string storeProcCommand = "P5SqlJobs_ForAnalytics";
            object? param = new { @Action = "GetDetailsList", p5sqljobsid, AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<P5SqlJobsForAnalytics?>(storeProcCommand);
        }
        public async Task<bool> UpdateLastExecutedDateForAnalytics(int AccountId, int p5sqljobsid)
        {
            string storeProcCommand = "P5SqlJobs_ForAnalytics";
            object? param = new { @Action = "UpdateDateTime", p5sqljobsid, AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
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

