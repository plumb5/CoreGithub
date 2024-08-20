using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;

namespace P5GenralDL
{
    public class DLScoreSettingsPG : CommonDataBaseInteraction, IDLScoreSettings
    {
        CommonInfo connection;
        public DLScoreSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }


        public async Task<Int32> Save(ScoreSettings scoreSettings)
        {
            string storeProcCommand = "select * from score_settings_save (@ScoreName, @IdentifierName, @Description, @Operator, @ScoringAreaType, @Channel, @Event, @Value, @Score, @CampaignId )";
            object? param = new { scoreSettings.ScoreName, scoreSettings.IdentifierName, scoreSettings.Description, scoreSettings.Operator, scoreSettings.ScoringAreaType, scoreSettings.Channel, scoreSettings.Event, scoreSettings.Value, scoreSettings.Score, scoreSettings.CampaignId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ScoreSettings>> GetDetails(string ScoringAreaType, string ScoreName)
        {
            string storeProcCommand = "select * from score_settings_get(@ScoringAreaType,@ScoreName)";
            object? param = new { ScoringAreaType, ScoreName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ScoreSettings>(storeProcCommand, param);

        }

        public async Task<bool>  Delete(string ScoringAreaType)
        {
            string storeProcCommand = "select * from score_settings_delete(@ScoringAreaType)";
            object? param = new { ScoringAreaType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<ScoreSettings>> GetSettingForAssignment()
        {
            string storeProcCommand = "select * from score_settings_getsettingforassignment()"; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ScoreSettings>(storeProcCommand );
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
