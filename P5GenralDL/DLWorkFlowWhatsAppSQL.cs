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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace P5GenralDL
{
    public class DLWorkFlowWhatsAppSQL : CommonDataBaseInteraction, IDLWorkFlowWhatsApp
    {
        CommonInfo connection;
        public DLWorkFlowWhatsAppSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int32> Save(MLWorkFlowWhatsApp WhatsappConfig)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new {Action= "Save", WhatsappConfig.WhatsAppTemplateId, WhatsappConfig.WhatsAppConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> SaveAsync(MLWorkFlowWhatsApp WhatsappConfig)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";

            object? param = new { Action = "Save", WhatsappConfig.WhatsAppTemplateId, WhatsappConfig.IsTriggerEveryActivity, WhatsappConfig.WhatsAppConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateAsync(MLWorkFlowWhatsApp WhatsappConfig)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "Update", WhatsappConfig.ConfigureWhatsAppId, WhatsappConfig.WhatsAppTemplateId, WhatsappConfig.IsTriggerEveryActivity, WhatsappConfig.WhatsAppConfigurationNameId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async void UpdateWorkflowWhatsAppCampaignSendStatus(int workflowwhatsappSendingSettingId)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "UpdateWorkflowWhatsAppCampaignSendStatus", workflowwhatsappSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<WorkFlowWhatsApp>> GetRecentWorkflowWhatsAppCampaignsForDailyOnce()
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "GetRecentWorkflowWhatsAppCampaignsForDailyOnce" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWhatsApp>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

        }

        public async Task<SendingDatalist?> GetDetails(int ConfigureWhatsAppId)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "GetDetails", ConfigureWhatsAppId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SendingDatalist?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<WorkFlowWhatsApp?> GetWhatsAppDetails(int ConfigureWhatsAppId)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "GetWhatsAppDetails", ConfigureWhatsAppId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WorkFlowWhatsApp?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<WorkFlowWhatsApp?> GetDetails(int ConfigureWhatsAppId, DateTime? FromDate, DateTime? ToDate, byte IsSplitTested = 0, string PhoneNumber = null)
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "GetDetails", ConfigureWhatsAppId, FromDate, ToDate, IsSplitTested, PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WorkFlowWhatsApp?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<IEnumerable<WorkFlowWhatsApp>> GetRecentWorkflowWhatsAppCampaignsForInterval()
        {
            string storeProcCommand = "WorkFlow_WhatsApp";
            object? param = new { Action = "GetRecentWorkflowWhatsAppCampaignsForInterval"};
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWhatsApp>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
