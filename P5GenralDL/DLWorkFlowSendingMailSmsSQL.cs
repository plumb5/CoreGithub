using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLWorkFlowSendingMailSmsSQL : CommonDataBaseInteraction, IDLWorkFlowSendingMailSms
    {
        CommonInfo connection;
        public DLWorkFlowSendingMailSmsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowSendingMailSmsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLMailSent>> GetMailBulkDetails(MLMailSent mailSent, int MaxLimit)
        {
            string storeProcCommand = "WorkFlow_MailBulkInsert";
            object? param = new { @Action = "GetMailBulkDetails", mailSent.SendStatus, mailSent.MailSendingSettingId, mailSent.WorkFlowId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> SaveToMailSent(DataTable mailSent)
        {
            string storeProcCommand = "WorkFlow_MailBulkInsert";
            object? param = new { @Action = "SaveToMailSent", mailSent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateTotalCounts(DataTable mailSent, int MailSendingSettingId)
        {
            string storeProcCommand = "WorkFlow_MailBulkInsert";
            object? param = new { @Action = "UpdateTotalCounts", mailSent, MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> DeleteFromWorkFlowBulkMailSent(DataTable mailSent)
        {
            string storeProcCommand = "WorkFlow_MailBulkInsert";
            object? param = new { @Action = "DeleteFromWorkFlowBulkMailSent", mailSent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<SmsSent>> GetSmsBulkDetails(int SmsSendingSettingId, int WorkFlowId, Int16 SendStatus, int MaxLimit)
        {
            string storeProcCommand = "WorkFlow_SmsBulkInsert";
            object? param = new { @Action = "GetSmsBulkDetails", SmsSendingSettingId, WorkFlowId, SendStatus, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
    }
}
