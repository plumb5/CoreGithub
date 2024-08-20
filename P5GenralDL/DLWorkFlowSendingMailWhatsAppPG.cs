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
    public class DLWorkFlowSendingMailWhatsAppPG : CommonDataBaseInteraction, IDLWorkFlowSendingMailWhatsApp
    {
        CommonInfo connection;
        public DLWorkFlowSendingMailWhatsAppPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowSendingMailWhatsAppPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLWhatsappSent>> GetWhatsAppBulkDetails(int WhatsAppSendingSettingId, int WorkFlowId, Int16 SendStatus, int MaxLimit)
        {
            string storeProcCommand = "select * from workflow_whatsappbulkinsert_getwhatsappbulkdetails(@WhatsAppSendingSettingId, @WorkFlowId, @SendStatus, @MaxLimit)";
            object? param = new { WhatsAppSendingSettingId,  WorkFlowId,  SendStatus,  MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsappSent>(storeProcCommand, param)).ToList();
        }
    }
}

