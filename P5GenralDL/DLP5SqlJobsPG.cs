using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLP5SqlJobsPG : CommonDataBaseInteraction, IDLP5SqlJobs
    {
        CommonInfo connection = null;
        public DLP5SqlJobsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLP5SqlJobsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<P5SqlJobs>> GetJobsDetails(P5SqlJobs p5SqlJobs)
        {
            string storeProcCommand = "select * from p5sql_jobs_getsqljobsdetailslist(@TimeInterval, @IsCached)";
            object? param = new { p5SqlJobs.TimeInterval, p5SqlJobs.IsCached };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<P5SqlJobs>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> UpdateStatus(P5SqlJobs p5SqlJobs)
        {
            string storeProcCommand = "select * from p5sql_jobs_updatestatus(@Id, @IsTimeIntervalCompleted, @LastExecuteDateTime)";
            object? param = new { p5SqlJobs.Id, p5SqlJobs.IsTimeIntervalCompleted, p5SqlJobs.LastExecuteDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ResetStatus(bool iscached)
        {
            string storeProcCommand = "select * from p5sql_jobs_resetstatus(@Iscached)";
            object? param = new { iscached };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateLastExecutedDate()
        {
            string storeProcCommand = "select * from p5sql_jobs_updatedatetime(@Iscached)";
           
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<P5SqlJobs?> GetRestartDetails()
        {
            string storeProcCommand = "select * from p5sql_jobs_getrestartdetails()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<P5SqlJobs>(storeProcCommand);
        }

        public async Task<P5SqlJobsForAnalytics?> GetDetails(int AccountId, int p5sqljobsid)
        {
            string storeProcCommand = "select * from p5sqljobsforanalytics_get(@P5sqljobsid, @AccountId)";
            object? param = new { p5sqljobsid, AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<P5SqlJobsForAnalytics?>(storeProcCommand);
        }
        public async Task<bool> UpdateLastExecutedDateForAnalytics(int AccountId, int p5sqljobsid)
        {
            string storeProcCommand = "select * from p5sqljobsforanalytics_updatedatetime(@P5sqljobsid, @AccountId)";
            object? param = new { p5sqljobsid, AccountId };
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

