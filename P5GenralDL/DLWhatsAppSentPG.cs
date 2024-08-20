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
using IP5GenralDL;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Pkcs;

namespace P5GenralDL
{
    public class DLWhatsAppSentPG : CommonDataBaseInteraction, IDLWhatsAppSent
    {
        CommonInfo connection;
        public DLWhatsAppSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<Int32> Save(WhatsappSent watsAppSent)
        {
            string storeProcCommand = "select * from whatsapp_sent_save(@WhatsappSendingSettingId, @ContactId, @PhoneNumber, @ResponseId, @ErrorMessage, @MessageContent, @SendStatus, @VendorName, @WhatsappTemplateId, @GroupId, @WorkFlowId, @WorkFlowDataId, @CampaignJobName, @UserAttributes, @ButtonOneDynamicURLSuffix, @ButtonTwoDynamicURLSuffix, @IsDelivered, @IsClicked, @MediaFileURL, @IsFailed, @P5WhatsappUniqueID, @WhatsAppConfigurationNameId, @UserInfoUserId, @Score, @LeadLabel, @Publisher, @LmsGroupMemberId)";
            object? param = new { watsAppSent.WhatsappSendingSettingId, watsAppSent.ContactId, watsAppSent.PhoneNumber, watsAppSent.ResponseId, watsAppSent.ErrorMessage, watsAppSent.MessageContent, watsAppSent.SendStatus, watsAppSent.VendorName, watsAppSent.WhatsappTemplateId, watsAppSent.GroupId, watsAppSent.WorkFlowId, watsAppSent.WorkFlowDataId, watsAppSent.CampaignJobName, watsAppSent.UserAttributes, watsAppSent.ButtonOneDynamicURLSuffix, watsAppSent.ButtonTwoDynamicURLSuffix, watsAppSent.IsDelivered, watsAppSent.IsClicked, watsAppSent.MediaFileURL, watsAppSent.IsFailed, watsAppSent.P5WhatsappUniqueID, watsAppSent.WhatsAppConfigurationNameId, watsAppSent.UserInfoUserId, watsAppSent.Score, watsAppSent.LeadLabel, watsAppSent.Publisher, watsAppSent.LmsGroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);

        }
        public async Task<List<MLWhatsaAppCampaign>> GetWhatsAppCampaignResponseData(int whatsappSendingSettingId)
        {
            string storeProcCommand = "select * from whatsapp_sent_getwhatsappcampaignresponsedata(@whatsappSendingSettingId)";
            object? param = new { whatsappSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsaAppCampaign>(storeProcCommand, param)).ToList();
        }
        public async Task<List<GroupMember>> GetContactIdList(int[] WhatsAppSendingSettingIdList, int[] CampaignResponseValue)
        {
            Int16 IsDelivered = 0;
            Int16 IsRead = 0;
            Int16 IsFailed = 0;
            bool Unsubscribed = false;
            foreach (int value in CampaignResponseValue)
            {
                if (value == 1)
                    IsDelivered = 1;
                else if (value == 2)
                    IsRead = 1;
                else if (value == 3)
                    IsFailed = 1;
                else if (value == 4)
                    Unsubscribed = true;
            }

             
            try
            {
                string storeProcCommand = "select * from whatsapp_sent_getcontactidlist(@WhatsAppSendingSettingIdList,@IsDelivered, @IsRead, @IsFailed, @Unsubscribed)";
                object? param = new { WhatsAppSendingSettingIdList = string.Join(",", WhatsAppSendingSettingIdList), IsDelivered, IsRead, IsFailed, Unsubscribed };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<GroupMember>(storeProcCommand, param)).ToList();
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
        }


        public async Task<int> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, int WATemplateId = 0, string PhoneNumber = null)
        {
            string storeProcCommand = "select * from whatsapp_sent_individualmaxcount(@FromDateTime, @ToDateTime, @WATemplateId, @PhoneNumber)";
            object? param = new { FromDateTime, ToDateTime, WATemplateId, PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<WhatsappSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int WATemplateId = 0, string PhoneNumber = null)
        {
            string storeProcCommand = "select * from whatsapp_sent_getindividualresponsedata(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @WATemplateId, @PhoneNumber)";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, WATemplateId, PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappSent>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> SentResponseAsync(string ResponseId, DateTime? received_at_utc)
        {
            string storeProcCommand = "select * from whatsapp_sent_sentresponse(@ResponseId, @received_at_utc)";
            object? param = new { ResponseId, received_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeliveredResponseAsync(string ResponseId, DateTime? delivered_at_utc)
        {
            string storeProcCommand = "select * from whatsapp_sent_deliveredresponse(@ResponseId, @delivered_at_utc)";
            object? param = new { ResponseId, delivered_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ReadResponseAsync(string ResponseId, DateTime? seen_at_utc)
        {
            string storeProcCommand = "select * from whatsapp_sent_readresponse(@ResponseId, @seen_at_utc)";
            object? param = new { ResponseId, seen_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> FailedResponseAsync(string ResponseId, string failReason, DateTime? received_at_utc)
        {
            string storeProcCommand = "select * from whatsapp_sent_failedresponse(@ResponseId, @failReason, @received_at_utc)";
            object? param = new { ResponseId, failReason, received_at_utc };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> SaveBulkWhatsAppResponsesForCampaign(DataTable whatsappSentBulk)
        {
            string jsonData = JsonConvert.SerializeObject(whatsappSentBulk, Formatting.Indented);
            string storeProcCommand = "select * from whatsapp_sent_saveresponsesforbulkcampaign(@jsonData)";
            object? param = new { jsonData };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteResponsesFromBulkCampaign(DataTable whatsappSentBulk)
        {
            string jsonData = JsonConvert.SerializeObject(whatsappSentBulk, Formatting.Indented);
            string storeProcCommand = "select * from whatsapp_sent_deleteresponsesfrombulkcampaign(@jsonData)";
            object? param = new { jsonData };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from whatsapp_sent_getconsumptioncount(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool> SaveWorkFlowBulk(DataTable WhatsAppSentBulk)
        {
            string jsonData = JsonConvert.SerializeObject(WhatsAppSentBulk, Formatting.Indented);
            string storeProcCommand = "select * from whatsapp_sent_saveworkflowbulk(@jsonData)";
            object? param = new { jsonData };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<bool> UpdateTotalCounts(DataTable WhatsAppSentBulk, int WhatsAppSendingSettingId)
        {
            string jsonData = JsonConvert.SerializeObject(WhatsAppSentBulk, Formatting.Indented);
            string storeProcCommand = "select * from whatsapp_sent_updatetotalcounts(@jsonData, @WhatsAppSendingSettingId)";
            object? param = new { jsonData, WhatsAppSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteFromWorkFlowBulkWhatsAppSent(DataTable WhatsAppSentBulk)
        {
            string jsonData = JsonConvert.SerializeObject(WhatsAppSentBulk, Formatting.Indented);
            string storeProcCommand = "select * from whatsapp_sent_deletefromworkflowbulkwhatsappsent(@jsonData)";
            object? param = new { jsonData };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<WhatsappSent?> ClickAsync(int WhatsappSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, string P5WhatsappUniqueID = null)
        {
            string storeProcCommand = "select * from whatsapp_sent_click(@WhatsappSendingSettingId, @ContactId, @WorkFlowId, @DeviceName, @DeviceType, @UserAgent, @P5WhatsappUniqueID)";
            object? param = new { WhatsappSendingSettingId, ContactId, WorkFlowId, DeviceName, DeviceType, UserAgent, P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsappSent>(storeProcCommand, param);
        }

        public async Task<bool> UnsubscribedResponseAsync(string PhoneNumber)
        {
            string storeProcCommand = "select * from whatsapp_sent_unsubscribedresponse(@PhoneNumber)";
            object? param = new { PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
