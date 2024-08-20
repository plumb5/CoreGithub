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
    public class DLSmsBulkSentPG : CommonDataBaseInteraction, IDLSmsBulkSent
    {
        CommonInfo connection;

        public DLSmsBulkSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsSent>> GetBulkSmsSentDetails(int SmsSendingSettingId, int MaxLimit)
        {
            string storeProcCommand = "select * from sms_bulksent_getsmssentcontacts(@SmsSendingSettingId, @MaxLimit)";
            object? param = new { SmsSendingSettingId, MaxLimit }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param);
        }

        public async Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds)
        {
            string SmsBulkSentId=string.Join(",", SmsBulkSentIds);
            string storeProcCommand = "select sms_bulksent_updatesmssentcontacts(@SmsBulkSentId)";
            object? param = new { SmsBulkSentId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<long>  GetTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "select sms_bulksent_gettotalbulksms(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }

        public async Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId)
        {
            string storeProcCommand = "select sms_bulksent_deletetotalbulksms(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
