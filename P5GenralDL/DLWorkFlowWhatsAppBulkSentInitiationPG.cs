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
    public class DLWorkFlowWhatsAppBulkSentInitiationPG : CommonDataBaseInteraction, IDLWorkFlowWhatsAppBulkSentInitiation
    {
        CommonInfo connection;

        public DLWorkFlowWhatsAppBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<WorkFlowWhatsAppBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_whatsappbulksentinitiation_getsentinitiation()";  
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWhatsAppBulkSentInitiation>(storeProcCommand);

        }

        public async Task<bool> UpdateSentInitiation(WorkFlowWhatsAppBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select workflow_whatsappbulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus, @WorkFlowId, @WorkFlowDataId)"; 
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }
        public async Task<Int32> Save(WorkFlowWhatsAppBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select WorkFlow_WhatsAppBulkSentInitiation_save(@SendingSettingId, @WorkFlowId, @WorkFlowDataId)"; 
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool> ResetInitiation()
        {
            string storeProcCommand = "select workflow_whatsappbulksentinitiation_resetinitiation()";
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand)>0;
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
