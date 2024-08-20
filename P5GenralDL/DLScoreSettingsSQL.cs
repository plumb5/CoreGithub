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
    public class DLScoreSettingsSQL : CommonDataBaseInteraction, IDLScoreSettings
    {
        CommonInfo connection;
        public DLScoreSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }


        public async Task<Int32> Save(ScoreSettings scoreSettings)
        {
            string storeProcCommand = "Score_Settings";
            object? param = new {Action= "Save", scoreSettings.ScoreName, scoreSettings.IdentifierName, scoreSettings.Description, scoreSettings.Operator, scoreSettings.ScoringAreaType, scoreSettings.Channel, scoreSettings.Event, scoreSettings.Value, scoreSettings.Score, scoreSettings.CampaignId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ScoreSettings>> GetDetails(string ScoringAreaType, string ScoreName)
        {
            string storeProcCommand = "Score_Settings";
            object? param = new { Action = "GET", ScoringAreaType, ScoreName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ScoreSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

        }

        public async Task<bool> Delete(string ScoringAreaType)
        {
            string storeProcCommand = "Score_Settings)";
            object? param = new { Action = "Delete", ScoringAreaType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<ScoreSettings>> GetSettingForAssignment()
        {
            string storeProcCommand = "Score_Settings";
            object? param = new { Action = "GetSettingForAssignment" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ScoreSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
