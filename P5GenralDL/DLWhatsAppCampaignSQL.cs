using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWhatsAppCampaignSQL : CommonDataBaseInteraction, IDLWhatsAppCampaign
    {
        CommonInfo connection;
        public DLWhatsAppCampaignSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppCampaignSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(WhatsAppCampaign WhatsAppCampaign)
        {
            string storeProcCommand = "WhatsApp_Campaign";
            object? param = new { Action="Save", WhatsAppCampaign.Name, WhatsAppCampaign.UserInfoUserId, WhatsAppCampaign.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(WhatsAppCampaign WhatsAppCampaign)
        {
            string storeProcCommand = "WhatsApp_Campaign";
            object? param = new { Action="Update", WhatsAppCampaign.Name, WhatsAppCampaign.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "WhatsApp_Campaign";
            object? param = new { Action="Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<List<WhatsAppCampaign>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName)
        {
            string storeProcCommand = "WhatsApp_Campaign";
            object? param = new { Action = "GET", ListOfId=string.Join(",", new List<int>(ListOfId).ToArray()), fieldName=fieldName != null ? string.Join(",", fieldName.ToArray()) : null };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<int> MaxCount(WhatsAppCampaign WhatsAppCampaign)
        {
            string storeProcCommand = "WhatsApp_Campaign";
            object? param = new { Action="MaxCount", WhatsAppCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
