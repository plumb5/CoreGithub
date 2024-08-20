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
    public class DLLeadScoringPG : CommonDataBaseInteraction, IDLLeadScoring
    {
        CommonInfo connection;
        public DLLeadScoringPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }


        public async Task<Int32> Save(LeadScoring leadScoring, string Action)
        {
            string storeProcCommand = "select * from lead_scoring(@Action,@IsActiveScoreSettings,@IsActiveThresholdSettings,@IsActiveDecaySettings)"; 
            object? param = new { Action, leadScoring.IsActiveScoreSettings, leadScoring.IsActiveThresholdSettings, leadScoring.IsActiveDecaySettings };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<LeadScoring?> GetDetails()
        {
            string storeProcCommand = "select * from lead_scoring_get()";  
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LeadScoring?>(storeProcCommand);
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
