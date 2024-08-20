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
using Dapper;

namespace P5GenralDL
{
    public class DLWhatsAppSentSQL : CommonDataBaseInteraction, IDLWhatsAppSent
    {
        CommonInfo connection;
        public DLWhatsAppSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<Int32> Save(WhatsappSent watsAppSent)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "Save", watsAppSent.WhatsappSendingSettingId, watsAppSent.ContactId, watsAppSent.PhoneNumber, watsAppSent.ResponseId, watsAppSent.ErrorMessage, watsAppSent.MessageContent, watsAppSent.SendStatus, watsAppSent.VendorName, watsAppSent.WhatsappTemplateId, watsAppSent.GroupId, watsAppSent.WorkFlowId, watsAppSent.WorkFlowDataId, watsAppSent.CampaignJobName, watsAppSent.UserAttributes, watsAppSent.ButtonOneDynamicURLSuffix, watsAppSent.ButtonTwoDynamicURLSuffix, watsAppSent.IsDelivered, watsAppSent.IsClicked, watsAppSent.MediaFileURL, watsAppSent.IsFailed, watsAppSent.P5WhatsappUniqueID, watsAppSent.WhatsAppConfigurationNameId, watsAppSent.UserInfoUserId, watsAppSent.Score, watsAppSent.LeadLabel, watsAppSent.Publisher, watsAppSent.LmsGroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLWhatsaAppCampaign>> GetWhatsAppCampaignResponseData(int whatsappSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "GetWhatsAppCampaignResponseData", whatsappSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsaAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<GroupMember>> GetContactIdList(int[] WhatsAppSendingSettingIdList, int[] CampaignResponseValue)
        {
            bool IsDelivered = false;
            bool IsClicked = false;
            Int16 NotDeliverStatus = 0;
            Int16? SendStatus = null;

            foreach (int value in CampaignResponseValue)
            {
                if (value == 1)
                    IsDelivered = true;
                else if (value == 2)
                    IsClicked = true;
                else if (value == 3)
                    NotDeliverStatus = 1;
                else if (value == 4)
                    SendStatus = 0;
            }

            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "GetContactIdList", WhatsAppSendingSettingIdList = string.Join(",", WhatsAppSendingSettingIdList), IsDelivered, IsClicked, NotDeliverStatus, SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }


        public async Task<int> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, int WATemplateId = 0, string PhoneNumber = null)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "IndividualMaxCount", FromDateTime, ToDateTime, WATemplateId, PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<WhatsappSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int WATemplateId = 0, string PhoneNumber = null)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "GetIndividualResponseData", FromDateTime, ToDateTime, OffSet, FetchNext, WATemplateId, PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> SentResponseAsync(string ResponseId, DateTime? received_at_utc)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "SentResponse", ResponseId, received_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeliveredResponseAsync(string ResponseId, DateTime? delivered_at_utc)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "DeliveredResponse", ResponseId, delivered_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ReadResponseAsync(string ResponseId, DateTime? seen_at_utc)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "ReadResponse", ResponseId, seen_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> FailedResponseAsync(string ResponseId, string failReason, DateTime? received_at_utc)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "FailedResponse", ResponseId, failReason, received_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> SaveBulkWhatsAppResponsesForCampaign(DataTable whatsappSentBulk)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "SaveResponsesForBulkCampaign", whatsappSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteResponsesFromBulkCampaign(DataTable whatsappSentBulk)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "DeleteResponsesFromBulkCampaign", whatsappSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "GetConsumptionCount", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> SaveWorkFlowBulk(DataTable WhatsAppSentBulk)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "SaveWorkFlowBulk", WhatsAppSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<bool> UpdateTotalCounts(DataTable WhatsAppSentBulk, int WhatsAppSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "UpdateTotalCounts", WhatsAppSentBulk, WhatsAppSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteFromWorkFlowBulkWhatsAppSent(DataTable WhatsAppSentBulk)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "DeleteFromWorkFlowBulkWhatsAppSent", WhatsAppSentBulk };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<WhatsappSent?> ClickAsync(int WhatsappSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, string P5WhatsappUniqueID = null)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "Click", WhatsappSendingSettingId, ContactId, WorkFlowId, DeviceName, DeviceType, UserAgent, P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsappSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UnsubscribedResponseAsync(string PhoneNumber)
        {
            string storeProcCommand = "WhatsApp_Sent";
            object? param = new { Action = "UnsubscribedResponse", PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
