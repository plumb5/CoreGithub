﻿using Dapper;
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
    public class DLLeadScoreDataSQL : CommonDataBaseInteraction, IDLLeadScoreData
    {
        CommonInfo connection;
        public DLLeadScoreDataSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async void SaveScore(LeadScoreData leadScoreData, string ScoreAction, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "leadscore_data";
            object? param = new { ScoreAction, leadScoreData.ScoreSettingsId, leadScoreData.ScoreName, leadScoreData.IdentifierName, leadScoreData.Description, leadScoreData.Operator, leadScoreData.ScoringAreaType, leadScoreData.Channel, leadScoreData.Event, leadScoreData.Value, leadScoreData.Score, leadScoreData.CampaignId, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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