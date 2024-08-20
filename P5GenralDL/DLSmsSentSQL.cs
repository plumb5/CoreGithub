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
    public class DLSmsSentSQL : CommonDataBaseInteraction, IDLSmsSent
    {
        CommonInfo connection;
        public DLSmsSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsSent smsSent)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action= "Save", smsSent.PhoneNumber, smsSent.SmsSendingSettingId, smsSent.ContactId, smsSent.ResponseId, smsSent.MessageContent, smsSent.SendStatus, smsSent.ProductIds, smsSent.VendorName, smsSent.SmsTemplateId, smsSent.ReasonForNotDelivery, smsSent.CampaignJobName, smsSent.IsUnicodeMessage, smsSent.P5SMSUniqueID, smsSent.MessageParts, smsSent.SmsConfigurationNameId, smsSent.UserInfoUserId, smsSent.Score, smsSent.LeadLabel, smsSent.Publisher, smsSent.LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "Deliverd", IsDelivered, NotDeliverStatus, PhoneNumber, SmsSendingSettingId, DeliveryTime, Operator, Circle, ReasonForNotDelivery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, int WorkFlowId = 0)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "NetCoreDeliverd", IsDelivered, NotDeliverStatus, PhoneNumber, SmsSendingSettingId, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId, WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsSent?> Click(int SmsSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, int TriggerMailSMSId = 0)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "Click", ContactId, SmsSendingSettingId, WorkFlowId, DeviceName, DeviceType, UserAgent, TriggerMailSMSId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> UpdateVerification(int ContactId, int IsVerifiedContactNumber)
        {
            string storeProcCommand = "Contact_CustomDetails";

            object? param = new { Action = "UpdateVerificationStatusOfSMS", ContactId, IsVerifiedContactNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateVerification(string PhoneNumber, int IsVerifiedContactNumber)
        {
            string storeProcCommand = "Contact_CustomDetails";

            object? param = new { Action = "UpdateVerificationStatusOfSMS", PhoneNumber, IsVerifiedContactNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MLSmsSentStatusReport?> GetSmsStatusCount(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetSmsStatusCount", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLSmsSentStatusReport?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(SmsSent SmsSent)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "Update", SmsSent.SmsSendingSettingId, SmsSent.ContactId, SmsSent.PhoneNumber, SmsSent.SendStatus, SmsSent.ResponseId, SmsSent.MessageContent, SmsSent.ProductIds, SmsSent.SentDate, SmsSent.IsDelivered, SmsSent.IsClicked, SmsSent.Operator, SmsSent.Circle, SmsSent.NotDeliverStatus, SmsSent.ReasonForNotDelivery, SmsSent.DeliveryTime, SmsSent.VendorName, SmsSent.WorkFlowId, SmsSent.WorkFlowDataId, SmsSent.CampaignJobName, SmsSent.SmsTemplateId, SmsSent.IsUnicodeMessage };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async Task<IEnumerable<GroupMember>> GetContactIdList(int[] SmsSendingSettingIdList, int[] CampaignResponseValue)
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
            string SmsSendingSettingIdLists = string.Join(",", SmsSendingSettingIdList);
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetContactIdList", SmsSendingSettingIdLists, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<GroupMember>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<Int32> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, string Phonenumber)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "IndividualMaxCount", FromDateTime, ToDateTime, Phonenumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLSmsSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Phonenumber)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetIndividualResponseData", FromDateTime, ToDateTime, OffSet, FetchNext, Phonenumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> SaveWorkFlowBulk(DataTable smsSentBulk)
        {
            string storeProcCommand = "Sms_Sent)";
            object? param = new { Action = "SaveWorkFlowBulk", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateTotalCounts(DataTable smsSentBulk, int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "UpdateTotalCounts", smsSentBulk, SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteFromWorkFlowBulkSmsSent(DataTable smsSentBulk)
        {
            string storeProcCommand = "Sms_Sent"; 
            object? param = new { Action = "DeleteFromWorkFlowBulkSmsSent", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteSentSmsBulk(DataTable smsSentBulk)
        {
            string storeProcCommand = "SmsBulkSentTime_Split";
            object? param = new { Action = "DeleteSentSmsBulk", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async Task<bool> SaveBulkSmsResponsesForCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "SaveResponsesForBulkCampaign", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeliverdByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "NetCoreDeliverdByResponseId", IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> SmsDeliveryException(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, string SqlException)
        {
            string storeProcCommand = "Sms_DeliveryException";
            object? param = new { Action = "Save", IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId, SqlException };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteResponsesFromBulkCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "DeleteResponsesFromBulkCampaign", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async void UpdateBulkSmsResponsesForCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "UpdateBulkSmsResponsesForCampaign", smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async void AclMobileDeliveryUpdate(string PhoneNumber, string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime DeliveryTime)
        {
            string storeProcCommand = "Sms_Sent";

            object? param = new { Action = "AclMobileDeliveryUpdate", PhoneNumber, ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> GetNonDeliveredContactsCount(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetNonDeliveredContactsCount", VendorName, SmsSentFromDate, SmsSentToDate, IsPromotionalOrTransactionalType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<SmsSent>> GetNonDeliveredContacts(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetNonDeliveredContactsCount", VendorName, SmsSentFromDate, SmsSentToDate, IsPromotionalOrTransactionalType, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async void DoveSoftDeliveryUpdate(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "DoveSoftDeliveryUpdate", ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime, BouncedDate };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task DoveSoftDeliveryUpdateAsync(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "DoveSoftDeliveryUpdate", ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime, BouncedDate };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetOpenAndClickedRate(string GroupIds)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetDeliveredAndClickedRate", GroupIds };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetConsumptionCount", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateOptOutByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "UpdateOptOutByResponseId", IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<MLSmsCampaign>> GetSMSCampaignResponseData(int SmsSendingSettingId)
        {
            string storeProcCommand = "Sms_Sent)";
            object? param = new { Action = "GetSMSCampaignResponseData", SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<SmsSent>> ClickAsync(int SmsSendingSettingId, int ContactId, int WorkFlowId, string DeviceName, string DeviceType, string UserAgent, int TriggerMailSMSId = 0, string P5SMSUniqueID = null)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "Click", ContactId, SmsSendingSettingId, WorkFlowId, DeviceName, DeviceType, UserAgent, TriggerMailSMSId, P5SMSUniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
