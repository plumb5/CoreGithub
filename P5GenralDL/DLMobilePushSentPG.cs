using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using NpgsqlTypes;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMobilePushSentPG : CommonDataBaseInteraction, IDLMobilePushSent
    {
        CommonInfo connection;

        public DLMobilePushSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> SaveBulkMobilePushCampaignResponses(DataTable MobilePushSentBulk)
        {
            string jsonData = JsonConvert.SerializeObject(MobilePushSentBulk);
            string storeProcCommand = "select mobilepush_sent_saveresponsesforbulkcampaign";

            var parameters = new DynamicParameters();
            parameters.Add("_dtmobilepushresponses", jsonData);

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, parameters) > 0;

        }

        public async Task<List<MobilePushSent>> GetMobilePushTestCampaign(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from mobilepush_sent_gettestcampaign()";
            object? param = new { OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushSent>(storeProcCommand, param)).ToList();
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
            string storeProcCommand = "select * from mobilepush_sent_getcontactidlist(@MobilePushSendingSettingIdLists,@IsViewed, @IsClicked, @IsClosed, @SendStatus)";
            object? param = new { MobilePushSendingSettingIdLists = string.Join(",", MobilePushSendingSettingIdList), IsViewed, IsClicked, IsClosed, SendStatus };


            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> UpdatePushResponseView(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "select mobilepush_sent_updateview(@DeviceId, @SendingSettingId, @P5UniqueId)";
            object? param = new { DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdatePushResponseClick(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "select mobilepush_sent_updateclick(@DeviceId, @SendingSettingId, @P5UniqueId)";
            object? param = new { DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdatePushResponseClose(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null)
        {
            string storeProcCommand = "select mobilepush_sent_updateclose(@DeviceId, @SendingSettingId, @P5UniqueId)";
            object? param = new { DeviceId, SendingSettingId, P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select mobilepush_sent_getconsumptioncount(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
