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
    public class DLWorkFlowWebHookBulkSentInitiationPG : CommonDataBaseInteraction, IDLWorkFlowWebHookBulkSentInitiation
    {
        CommonInfo connection;

        public DLWorkFlowWebHookBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebHookBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<WorkFlowWebHookBulkSentInitiation>>  GetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_webhookbulksentinitiation_getsentinitiation()";  
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebHookBulkSentInitiation>(storeProcCommand);

        }

        public async Task<bool> UpdateSentInitiation(WorkFlowWebHookBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select workflow_webhookbulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus, @WorkFlowId, @WorkFlowDataId )"; 
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;

        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "select workflow_webhookbulksentinitiation_resetsentinitiation()";
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
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
