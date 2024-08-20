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
    internal class DLSmsBulkSentDynamicContentPG : CommonDataBaseInteraction, IDLSmsBulkSentDynamicContent
    {
        CommonInfo connection;

        public DLSmsBulkSentDynamicContentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentDynamicContentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsSendingSetting>>  GetBulkSmsSendingSettingList(Int16 SendStatus)
        {
            string storeProcCommand = "select * from sms_bulksentdynamiccontent_getbulksmssendingids(@SendStatus)";
            object? param = new { SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSendingSetting>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from sms_bulksentdynamiccontent_getdetailsformessageupdate(@SmsSendingSettingId)"; 
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param);
        }


        public async void UpdateMessageContent(DataTable AllData)
        {
            string storeProcCommand = "select sms_bulksentdynamiccontent_updatemessagecontent(@AllData)";
            object? param = new { AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async void DeleteMessageContent(DataTable AllData)
        {
            string storeProcCommand = "select sms_bulksentdynamiccontent_deletemessagecontent(@AllData)"; 
            object? param = new { AllData };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
