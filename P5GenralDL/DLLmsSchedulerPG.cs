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
    public class DLLmsSchedulerPG : CommonDataBaseInteraction, IDLLmsScheduler
    {
        CommonInfo connection;
        public DLLmsSchedulerPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsSchedulerPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DataSet> GetReminderDetails()
        {
            string storeProcCommand = "select * from lms_leadreminderdetails_reminderdetails()";

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        #region Lms Mail Or Sms Scheduler

        public async Task<DataSet> LmsSmsReminderDetails()
        {
            string storeProcCommand = "select * from lms_leadreminderdetails_smsreminderdetails()";

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> LmsWhatsAppReminderDetails()
        {
            string storeProcCommand = "select * from lms_leadreminderdetails_whatsappreminderdetails()";

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> LmsMailAlertReminderDetails()
        {
            string storeProcCommand = "select * from lms_leadreminderdetails_mailreminderdetails()";

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        #endregion

        #region mail report scheduler

        public async Task<bool> UpdateMailAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "select lms_leadreminderdetails_updatemailalertschedulesentstatus(@Id, @ContactId, @Status)";
            object? param = new { Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateSmsAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "select lms_leadreminderdetails_updatesmsalertschedulesentstatus(@Id, @ContactId, @Status)";
            object? param = new { Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateWhatsAppAlertScheduleSentStatus(int Id, int ContactId, string Status)
        {
            string storeProcCommand = "select lms_leadreminderdetails_updatewhatsappalertschedulesentstatus(@Id, @ContactId, @Status)";
            object? param = new { Id, ContactId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
