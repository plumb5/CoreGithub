using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobileInAppResponsesSQL : CommonDataBaseInteraction, IDLMobileInAppResponses
    {
        CommonInfo connection;
        public DLMobileInAppResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        
        public async Task<bool> InsertPushResponseView(string DeviceId, int InAppCampaignId = 0, string SessionId = null, string GeofenceName = null, string BeaconName = null)
        {
            string storeProcCommand = "MobileInApp_Responses";
            object? param = new { Action = "UpdateView", DeviceId, InAppCampaignId, SessionId, GeofenceName, BeaconName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> UpdatePushResponseClick(string DeviceId, int InAppCampaignId = 0)
        {
            string storeProcCommand = "MobileInApp_Responses";
            object? param = new { Action = "UpdateClick", DeviceId, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }


        public async Task<bool> UpdatePushResponseClose(string DeviceId, int InAppCampaignId = 0)
        {
            string storeProcCommand = "MobileInApp_Responses";
            object? param = new { Action = "UpdateClose", DeviceId, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "MobileInApp_Responses";
            object? param = new { Action="MaxCount", FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MobileInAppCampaign>> GetInAppResponsesReport(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null)
        {
            string storeProcCommand = "MobileInApp_Responses";
            object? param = new { Action = "GetAll", OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
