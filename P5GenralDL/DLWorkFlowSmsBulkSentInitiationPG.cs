using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWorkFlowSmsBulkSentInitiationPG : CommonDataBaseInteraction, IDLWorkFlowSmsBulkSentInitiation
    {
        CommonInfo connection;
        public DLWorkFlowSmsBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowSmsBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WorkFlowSmsBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_smsbulksentinitiation_getsentinitiation()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowSmsBulkSentInitiation>(storeProcCommand)).ToList();
        }

        public async Task<bool> UpdateSentInitiation(WorkFlowSmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from workflow_smsbulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus, @WorkFlowId, @WorkFlowDataId)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ResetInitiation()
        {
            string storeProcCommand = "select * from workflow_smsbulksentinitiation_resetinitiation()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<int> Save(WorkFlowSmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select * from workflow_smsbulksentinitiation_save(@Action, @SendingSettingId, @WorkFlowId, @WorkFlowDataId, @IsPromotionalOrTransactionalType)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId, BulkSentInitiation.IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
    }
}

