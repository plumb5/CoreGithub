using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLWorkFlowSendingMailWhatsAppSQL : CommonDataBaseInteraction, IDLWorkFlowSendingMailWhatsApp
    {
        CommonInfo connection;
        public DLWorkFlowSendingMailWhatsAppSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowSendingMailWhatsAppSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLWhatsappSent>> GetWhatsAppBulkDetails(int WhatsAppSendingSettingId, int WorkFlowId, Int16 SendStatus, int MaxLimit)
        {
            string storeProcCommand = "WorkFlow_WhatsAppBulkInsert";
            object? param = new { @Action = "GetWhatsAppBulkDetails", WhatsAppSendingSettingId, WorkFlowId, SendStatus, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsappSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
    }
}


