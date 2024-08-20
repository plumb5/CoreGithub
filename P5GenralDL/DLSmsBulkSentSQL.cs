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
    public class DLSmsBulkSentSQL : CommonDataBaseInteraction, IDLSmsBulkSent
    {
        CommonInfo connection;

        public DLSmsBulkSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsSent>> GetBulkSmsSentDetails(int SmsSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "Sms_BulkSent";
            object? param = new { Action= "GetSmsSentContacts", SmsSendingSettingId, MaxLimit };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds)
        {
            string SmsBulkSentId = string.Join(",", SmsBulkSentIds);
            string storeProcCommand = "Sms_BulkSent";
            object? param = new { Action = "UpdateSmsSentContacts", SmsBulkSentId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<long> GetTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_BulkSent";
            object? param = new { Action = "GetTotalBulkSms", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_BulkSent";
            object? param = new { Action = "DeleteTotalBulkSms", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
