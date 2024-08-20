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
    public class DLLeadScoreThresholdSettingsSQL : CommonDataBaseInteraction, IDLLeadScoreThresholdSettings
    {
        CommonInfo connection;
        public DLLeadScoreThresholdSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<LeadScoreThresholdSettings>> GetList()
        {
            string storeProcCommand = "LeadScore_ThresholdSettings";
            object? param = new { Action= "GetList" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LeadScoreThresholdSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public void UpdateLeadBasedOnScore(LeadScoreThresholdSettings thresholdSettings)
        {
            string storeProcCommand = "LeadScore_ThresholdSettings";
            object? param = new { Action = "UpdateLeadBasedOnScore", thresholdSettings.Score, thresholdSettings.Label, thresholdSettings.StageId, thresholdSettings.GroupId, thresholdSettings.AgentId };
            using var db = GetDbConnection(connection.Connection);

            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<Int32> Save(LeadScoreThresholdSettings thresholdSettings)
        {
            string storeProcCommand = "LeadScore_ThresholdSettings";
            object? param = new { Action = "Save", thresholdSettings.Score, thresholdSettings.Label, thresholdSettings.StageId, thresholdSettings.GroupId, thresholdSettings.AgentId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> Delete(int id = 0)
        {
            string storeProcCommand = "LeadScore_ThresholdSettings";
            object? param = new { Action = "Delete", id };
            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
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
