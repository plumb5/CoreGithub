using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsBulkSentTimeSplitInitiationPG : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitInitiation
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<SmsBulkSentTimeSplitInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from smsbulksenttime_splitinitiation_getsentinitiation()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplitInitiation>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateSentInitiation(SmsBulkSentTimeSplitInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from smsbulksenttime_splitinitiation_updatesentinitiation(@SendingSettingId,@InitiationStatus)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> Save(SmsBulkSentTimeSplitInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from smsbulksenttime_splitinitiation_save(@SendingSettingId,@IsPromotionalOrTransactionalType)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
    }
}
