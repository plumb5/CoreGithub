using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;
using Newtonsoft.Json;

namespace P5GenralDL
{
    public class DLRuleCheckingPG : CommonDataBaseInteraction, IDLRuleChecking
    {
        CommonInfo connection = null;
        public DLRuleCheckingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLRuleCheckingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Saverulecheck(DataTable dtruleschecking)
        {
            string storeProcCommand = "select * from rule_checking_saverulechecking(@Bulkrulechecking)";
            //object? param = new { dtruleschecking };
            object? param = new { bulkrulechecking = new JsonParameter(JsonConvert.SerializeObject(dtruleschecking)) };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

