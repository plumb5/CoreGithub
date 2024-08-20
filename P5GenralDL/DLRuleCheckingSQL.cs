using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLRuleCheckingSQL : CommonDataBaseInteraction, IDLRuleChecking
    {
        CommonInfo connection = null;
        public DLRuleCheckingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLRuleCheckingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Saverulecheck(DataTable dtruleschecking)
        {
            string storeProcCommand = "Rule_Checking";
            object? param = new { @Action = "SaveRuleChecking", dtruleschecking };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

