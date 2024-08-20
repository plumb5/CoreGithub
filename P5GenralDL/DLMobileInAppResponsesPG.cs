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
    public class DLMobileInAppResponsesPG : CommonDataBaseInteraction, IDLMobileInAppResponses
    {
        CommonInfo connection;
        public DLMobileInAppResponsesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppResponsesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> InsertPushResponseView(string DeviceId, int InAppCampaignId = 0, string SessionId = null, string GeofenceName = null, string BeaconName = null)
        {
            string storeProcCommand = "select * from mobileinapp_responses_updateview(@DeviceId, @InAppCampaignId, @SessionId, @GeofenceName, @BeaconName)";
            object? param = new { DeviceId, InAppCampaignId, SessionId, GeofenceName, BeaconName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> UpdatePushResponseClick(string DeviceId, int InAppCampaignId = 0)
        {
            string storeProcCommand = "select * from mobileinapp_responses_updateclick(@DeviceId, @InAppCampaignId)";
            object? param = new { DeviceId, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> UpdatePushResponseClose(string DeviceId, int InAppCampaignId = 0)
        {
            string storeProcCommand = "select * from mobileinapp_responses_updateclose(@DeviceId, @InAppCampaignId)";
            object? param = new { DeviceId, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "select * from mobileinapp_responses_maxcount(@FromDate, @ToDate, @Name)";
            object? param = new { FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MobileInAppCampaign>> GetInAppResponsesReport(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null)
        {
            string storeProcCommand = "select * from mobileinapp_responses_getall(@OffSet, @FetchNext, @FromDate, @ToDate, @Name)";
            object? param = new { OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param)).ToList();

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
