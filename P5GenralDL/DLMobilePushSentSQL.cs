using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMobilePushSentSQL : CommonDataBaseInteraction, IDLMobilePushSent
    {
        CommonInfo connection;

        public DLMobilePushSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> SaveBulkMobilePushCampaignResponses(DataTable MobilePushSentBulk)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "SaveResponsesForBulkCampaign", MobilePushSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MobilePushSent>> GetMobilePushTestCampaign(int OffSet, int FetchNext)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "GetTestCampaignMaxCount", OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<GroupMember>> GetContactIdList(int[] MobilePushSendingSettingIdList, int[] CampaignResponseValue)
        {
            Int16 IsViewed = 0;
            Int16 IsClicked = 0;
            Int16 IsClosed = 0;
            Int16 SendStatus = 0;

            foreach (int value in CampaignResponseValue)
            {
                if (value == 1)
                    IsViewed = 1;
                else if (value == 2)
                    IsClicked = 1;
                else if (value == 3)
                    IsClosed = 1;
                else if (value == 4)
                    SendStatus = 0;
            }
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "GetContactIdList", MobilePushSendingSettingIdLists = string.Join(",", MobilePushSendingSettingIdList), IsViewed, IsClicked, IsClosed, SendStatus };


            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> UpdatePushResponseView(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "UpdateView", DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdatePushResponseClick(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "UpdateClick", DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdatePushResponseClose(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "UpdateClose", DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "MobilePush_Sent";
            object? param = new { Action = "GetConsumptionCount", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
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
