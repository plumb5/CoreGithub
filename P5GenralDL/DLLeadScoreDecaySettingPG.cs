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
    public class DLLeadScoreDecaySettingPG : CommonDataBaseInteraction , IDLLeadScoreDecaySetting
    {
        CommonInfo connection;
        public DLLeadScoreDecaySettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<LeadScoreDecaySetting>> GetList()
        {
            string storeProcCommand = "select * from leadscore_decaysetting_getlist()";
            List<string> paramName = new List<string> { };
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LeadScoreDecaySetting>(storeProcCommand, param);
        }

        public async void UpdateLeadScoreBasedOnActivity(LeadScoreDecaySetting decaySetting, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select leadscore_decaysetting_updateleadscorebasedonactivity(@NonActivityDays, @IsClearScore, @ScoreSubstract, @FromDateTime, @ToDateTime)";
            object? param = new { decaySetting.NonActivityDays, decaySetting.IsClearScore, decaySetting.ScoreSubstract, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> Save(LeadScoreDecaySetting decaySetting)
        {
            string storeProcCommand = "select leadscore_decaysetting_save(@NonActivityDays, @IsActive, @IsClearScore, @ScoreSubstract, @CreatedUserInfoUserId)";
            object? param = new { decaySetting.NonActivityDays, decaySetting.IsActive, decaySetting.IsClearScore, decaySetting.ScoreSubstract, decaySetting.CreatedUserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool>  Delete()
        {
            string storeProcCommand = "select leadscore_decaysetting_delete()";
            List<string> paramName = new List<string> { };
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
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
