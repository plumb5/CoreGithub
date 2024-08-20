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
    public class DLWhatsappBulkSentInitiationSQL : CommonDataBaseInteraction, IDLWhatsappBulkSentInitiation
    {
        CommonInfo connection;
        public DLWhatsappBulkSentInitiationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsappBulkSentInitiationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WhatsappBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "Whatsapp_BulkSentInitiation";
            object? param = new { Action= "Save", BulkSentInitiation.SendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<WhatsappBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "Whatsapp_BulkSentInitiation";
            object? param = new { Action = "GetSentInitiation"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappBulkSentInitiation>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> UpdateSentInitiation(WhatsappBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "Whatsapp_BulkSentInitiation";
            object? param = new { Action = "UpdateSentInitiation", BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "Whatsapp_BulkSentInitiation";
            object? param = new { Action = "ResetSentInitiation"};

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
    }
}
