using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLLmsSchedulerSQL : CommonDataBaseInteraction, IDLLmsScheduler
    {
        CommonInfo connection;
        public DLLmsSchedulerSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsSchedulerSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DataSet> GetReminderDetails()
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "ReminderDetails" };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        #region Lms Mail Or Sms Scheduler

        public async Task<DataSet> LmsSmsReminderDetails()
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "SMSReminderDetails" };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> LmsWhatsAppReminderDetails()
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "WhatsappReminderDetails" };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> LmsMailAlertReminderDetails()
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "MailReminderDetails" };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        #endregion

        #region mail report scheduler

        public async Task<bool> UpdateMailAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "UpdateMailAlertScheduleSentStatus", Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateSmsAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "UpdateSmsAlertScheduleSentStatus", Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateWhatsAppAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "Lms_LeadReminderDetails";
            object? param = new { Action = "UpdateWhatsappAlertScheduleSentStatus", Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        #endregion

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
