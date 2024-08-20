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
    public class DLLeadScoreDecaySettingSQL : CommonDataBaseInteraction, IDLLeadScoreDecaySetting
    {
        CommonInfo connection;
        public DLLeadScoreDecaySettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<LeadScoreDecaySetting>> GetList()
        {
            string storeProcCommand = "LeadScore_DecaySetting";
            List<string> paramName = new List<string> { };
            object? param = new {Action= "GetList" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LeadScoreDecaySetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async void UpdateLeadScoreBasedOnActivity(LeadScoreDecaySetting decaySetting, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "LeadScore_DecaySetting";
            object? param = new { Action = "UpdateLeadScoreBasedOnActivity", decaySetting.NonActivityDays, decaySetting.IsClearScore, decaySetting.ScoreSubstract, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> Save(LeadScoreDecaySetting decaySetting)
        {
            string storeProcCommand = "LeadScore_DecaySetting";
            object? param = new { Action = "Save", decaySetting.NonActivityDays, decaySetting.IsActive, decaySetting.IsClearScore, decaySetting.ScoreSubstract, decaySetting.CreatedUserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> Delete()
        {
            string storeProcCommand = "LeadScore_DecaySetting";
            List<string> paramName = new List<string> { };
            object? param = new { Action = "Delete" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
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
