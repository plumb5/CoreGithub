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
    public class DLMailBulkSentInitiationPG : CommonDataBaseInteraction, IDLMailBulkSentInitiation
    {
        CommonInfo connection;
        public DLMailBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MailBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from mail_bulksentinitiation_getsentinitiation()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailBulkSentInitiation>(storeProcCommand)).ToList();
        }

        public async Task<bool> UpdateSentInitiation(MailBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select mail_bulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "select mail_bulksentinitiation_resetsentinitiation()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand) > 0;
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

