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
    public class DLMailBulkSentPG : CommonDataBaseInteraction, IDLMailBulkSent
    {
        CommonInfo connection = null;
        public DLMailBulkSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBulkSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> InsertToMailSent(DataTable mailsentbulk)
        {
            string storeProcCommand = "select mail_bulksent_save(@Mailsentbulk)";
            object? param = new { mailsentbulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> UpdateBulkMailSentDetails(List<long> MailBulkSentIds)
        {
            string value = string.Join(",", MailBulkSentIds);
            string storeProcCommand = "select mail_bulksent_updatemailsentcontacts(@MailBulkSentIds)";
            object? param = new { value };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteSentMailBulk(int MailSendingSettingId)
        {
            string storeProcCommand = "select mail_bulksent_deletesentmailbulk(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteTotalBulkMail(int MailSendingSettingId)
        {
            string storeProcCommand = "select mail_bulksent_deletetotalbulkmail(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<long> GetTotalBulkMail(int MailSendingSettingId)
        {
            string storeProcCommand = "select mail_bulksent_gettotalbulkmail(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }
        public async Task<List<MLMailSent>> GetBulkMailSentDetails(int MailSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "select *  from mail_bulksent_getmailsentcontacts(@MailSendingSettingId,@MaxLimit)";
            object? param = new { MailSendingSettingId, MaxLimit };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailSent>(storeProcCommand, param)).ToList();
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

