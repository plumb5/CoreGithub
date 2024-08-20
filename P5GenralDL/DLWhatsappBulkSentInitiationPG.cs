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
    public class DLWhatsappBulkSentInitiationPG : CommonDataBaseInteraction, IDLWhatsappBulkSentInitiation
    {
        CommonInfo connection;
        public DLWhatsappBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsappBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WhatsappBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from whatsapp_bulksentinitiation_save(@SendingSettingId)";
            object? param = new { BulkSentInitiation.SendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<WhatsappBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from whatsapp_bulksentinitiation_getsentinitiation()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappBulkSentInitiation>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateSentInitiation(WhatsappBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from whatsapp_bulksentinitiation_updatesentinitiation(@SendingSettingId,@InitiationStatus)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "select * from whatsapp_bulksentinitiation_resetsentinitiation()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
    }
}
