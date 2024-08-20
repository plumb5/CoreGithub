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
    public class DLWorkFlowMailBulkSentInitiationPG : CommonDataBaseInteraction, IDLWorkFlowMailBulkSentInitiation
    {
        CommonInfo connection;
        public DLWorkFlowMailBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowMailBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WorkFlowMailBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_mailbulksentinitiation_getsentinitiation()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowMailBulkSentInitiation>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateSentInitiation(WorkFlowMailBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from workflow_mailbulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus, @WorkFlowId, @WorkFlowDataId)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_mailbulksentinitiation_resetsentinitiation()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> Save(WorkFlowMailBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from WorkFlow_MailBulkSentInitiation(@Action, @SendingSettingId, @WorkFlowId, @WorkFlowDataId, @IsPromotionalOrTransactionalType)";
            object? param = new { Action = "Save", BulkSentInitiation.SendingSettingId, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId, BulkSentInitiation.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
    }
}
