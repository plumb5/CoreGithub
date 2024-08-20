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
    public class DLSmsBulkSentTimeSplitInitiationSQL : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitInitiation
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitInitiationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitInitiationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<SmsBulkSentTimeSplitInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "SmsBulkSentTime_SplitInitiation";
            object? param = new { Action = "GetSentInitiation"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplitInitiation>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> UpdateSentInitiation(SmsBulkSentTimeSplitInitiation BulkSentInitiation)
        {
            string storeProcCommand = "SmsBulkSentTime_SplitInitiation";
            object? param = new { Action = "UpdateSentInitiation", BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<int> Save(SmsBulkSentTimeSplitInitiation BulkSentInitiation)
        {
            string storeProcCommand = "SmsBulkSentTime_SplitInitiation";
            object? param = new { Action= "Save", BulkSentInitiation.SendingSettingId, BulkSentInitiation.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
    }
}
