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

namespace P5GenralDL
{
    public class DLSmsSentPG : CommonDataBaseInteraction, IDLSmsSent
    {
        CommonInfo connection;
        public DLSmsSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
 
        public async Task<Int32> Save(SmsSent smsSent)
        {
            string storeProcCommand = "select sms_sent_save(@PhoneNumber, @SmsSendingSettingId, @ContactId, @ResponseId, @MessageContent, @SendStatus, @ProductIds, @VendorName, @SmsTemplateId, @ReasonForNotDelivery, @CampaignJobName, @IsUnicodeMessage, @P5SMSUniqueID, @MessageParts, @SmsConfigurationNameId, @UserInfoUserId, @Score, @LeadLabel, @Publisher, @LmsGroupMemberId )";
            object? param = new { smsSent.PhoneNumber, smsSent.SmsSendingSettingId, smsSent.ContactId, smsSent.ResponseId, smsSent.MessageContent, smsSent.SendStatus, smsSent.ProductIds, smsSent.VendorName, smsSent.SmsTemplateId, smsSent.ReasonForNotDelivery, smsSent.CampaignJobName, smsSent.IsUnicodeMessage, smsSent.P5SMSUniqueID, smsSent.MessageParts, smsSent.SmsConfigurationNameId, smsSent.UserInfoUserId, smsSent.Score, smsSent.LeadLabel, smsSent.Publisher, smsSent.LmsGroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
         
        public async Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery)
        {
            string storeProcCommand = "select * from sms_sent_deliverd(@IsDelivered, @NotDeliverStatus, @PhoneNumber, @SmsSendingSettingId, @DeliveryTime, @Operator, @Circle, @ReasonForNotDelivery )"; 
            object? param = new { IsDelivered, NotDeliverStatus, PhoneNumber, SmsSendingSettingId, DeliveryTime, Operator, Circle, ReasonForNotDelivery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param);
        }

        public async Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, int WorkFlowId = 0)
        {
            string storeProcCommand = "select * from sms_sent_netcoredeliverd(@IsDelivered, @NotDeliverStatus, @PhoneNumber, @SmsSendingSettingId, @DeliveryTime, @Operator, @Circle, @ReasonForNotDelivery, @ResponseId, @WorkFlowId )"; 
            object? param = new { IsDelivered, NotDeliverStatus, PhoneNumber, SmsSendingSettingId, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId, WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param);
        }

        public async Task<SmsSent?> Click(int SmsSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, int TriggerMailSMSId = 0)
        {
            string storeProcCommand = "select * from sms_sent_click(@ContactId, @SmsSendingSettingId, @WorkFlowId, @DeviceName, @DeviceType, @UserAgent, @TriggerMailSMSId)"; 
            object? param = new { ContactId, SmsSendingSettingId, WorkFlowId, DeviceName, DeviceType, UserAgent, TriggerMailSMSId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsSent?>(storeProcCommand, param);
        }
         
        public async Task<bool> UpdateVerification(int ContactId, int IsVerifiedContactNumber)
        {
            string storeProcCommand = "select  contact_customdetails_updateverificationstatusofsms(@ContactId, @IsVerifiedContactNumber)";
            
            object? param = new { ContactId, IsVerifiedContactNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<bool> UpdateVerification(string PhoneNumber, int IsVerifiedContactNumber)
        {
            string storeProcCommand = "select contact_customdetails_updateverificationstatusofsms(@PhoneNumber, @IsVerifiedContactNumber)";
             
            object? param = new { PhoneNumber, IsVerifiedContactNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
           
        public async Task<MLSmsSentStatusReport?> GetSmsStatusCount(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from sms_sent_getsmsstatuscount(@SmsSendingSettingId)"; 
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLSmsSentStatusReport?>(storeProcCommand, param);
        }

        public async Task<bool> Update(SmsSent SmsSent)
        {
            string storeProcCommand = "select  sms_sent_update(@SmsSendingSettingId, @ContactId, @PhoneNumber, @SendStatus, @ResponseId, @MessageContent, @ProductIds, @SentDate, @IsDelivered, @IsClicked, @Operator, @Circle, @NotDeliverStatus, @ReasonForNotDelivery, @DeliveryTime, @VendorName, @WorkFlowId, @WorkFlowDataId, @CampaignJobName, @SmsTemplateId, @IsUnicodeMessage)";
            object? param = new { SmsSent.SmsSendingSettingId, SmsSent.ContactId, SmsSent.PhoneNumber, SmsSent.SendStatus, SmsSent.ResponseId, SmsSent.MessageContent, SmsSent.ProductIds, SmsSent.SentDate, SmsSent.IsDelivered, SmsSent.IsClicked, SmsSent.Operator, SmsSent.Circle, SmsSent.NotDeliverStatus, SmsSent.ReasonForNotDelivery, SmsSent.DeliveryTime, SmsSent.VendorName, SmsSent.WorkFlowId, SmsSent.WorkFlowDataId, SmsSent.CampaignJobName, SmsSent.SmsTemplateId, SmsSent.IsUnicodeMessage };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
            string storeProcCommand = "select * from sms_sent_getcontactidlist(@SmsSendingSettingIdLists, @IsDelivered, @IsClicked, @NotDeliverStatus, @SendStatus)";
            object? param = new { SmsSendingSettingIdLists, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<GroupMember>(storeProcCommand, param);
        }


        public async Task<Int32> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, string Phonenumber)
        {
            string storeProcCommand = "select sms_sent_individualmaxcount(@FromDateTime, @ToDateTime, @Phonenumber)"; 
            object? param = new { FromDateTime, ToDateTime, Phonenumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLSmsSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Phonenumber)
        {
            string storeProcCommand = "select * from sms_sent_getindividualresponsedata(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @Phonenumber)";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, Phonenumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsSent>(storeProcCommand, param);
        }
           
        public async Task<bool>  SaveWorkFlowBulk(DataTable smsSentBulk)
        {
            string storeProcCommand = "select sms_sent_saveworkflowbulk(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<bool> UpdateTotalCounts(DataTable smsSentBulk, int SmsSendingSettingId)
        {
            string storeProcCommand = "select sms_sent_updatetotalcounts(@smsSentBulk, @SmsSendingSettingId )"; 
            object? param = new { smsSentBulk, SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteFromWorkFlowBulkSmsSent(DataTable smsSentBulk)
        {
            string storeProcCommand = "select sms_sent_deletefromworkflowbulksmssent(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
         
        public async Task<bool> DeleteSentSmsBulk(DataTable smsSentBulk)
        {
            string storeProcCommand = "select smsbulksenttime_split_deletesentsmsbulk(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }


        public async Task<bool> SaveBulkSmsResponsesForCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "select sms_sent_saveresponsesforbulkcampaign(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeliverdByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId)
        {
            string storeProcCommand = "select sms_sent_netcoredeliverdbyresponseid( @IsDelivered, @NotDeliverStatus, @DeliveryTime, @Operator, @Circle, @ReasonForNotDelivery, @ResponseId )"; 
            object? param = new { IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> SmsDeliveryException(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, string SqlException)
        {
            string storeProcCommand = "select sms_deliveryexception_save(@IsDelivered, @NotDeliverStatus, @DeliveryTime, @Operator, @Circle, @ReasonForNotDelivery, @ResponseId, @SqlException)";
            object? param = new { IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId, SqlException };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteResponsesFromBulkCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "select sms_sent_deleteresponsesfrombulkcampaign(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
         
        public async void UpdateBulkSmsResponsesForCampaign(DataTable smsSentBulk)
        {
            string storeProcCommand = "select sms_sent_updatebulksmsresponsesforcampaign(@smsSentBulk)"; 
            object? param = new { smsSentBulk };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }


        public async void AclMobileDeliveryUpdate(string PhoneNumber, string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime DeliveryTime)
        {
            string storeProcCommand = "select sms_sent_aclmobiledeliveryupdate( @PhoneNumber, @ResponseId, @IsDelivered, @NotDeliverStatus, @ReasonForNotDelivery, @DeliveryTime )";

            object? param = new { PhoneNumber, ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> GetNonDeliveredContactsCount(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType)
        {
            string storeProcCommand = "select sms_sent_getnondeliveredcontactscount(@VendorName, @SmsSentFromDate, @SmsSentToDate, @IsPromotionalOrTransactionalType)"; 
            object? param = new { VendorName, SmsSentFromDate, SmsSentToDate, IsPromotionalOrTransactionalType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsSent>>   GetNonDeliveredContacts(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from sms_sent_getnondeliveredcontacts(@VendorName, @SmsSentFromDate, @SmsSentToDate, @IsPromotionalOrTransactionalType, @OffSet, @FetchNext)"; 
            object? param = new { VendorName, SmsSentFromDate, SmsSentToDate, IsPromotionalOrTransactionalType, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param);
        }

        public async void DoveSoftDeliveryUpdate(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate)
        {
            string storeProcCommand = "select sms_sent_dovesoftdeliveryupdate(@ResponseId, @IsDelivered, @NotDeliverStatus, @ReasonForNotDelivery, @DeliveryTime, @BouncedDate)";
            object? param = new { ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime, BouncedDate };
            using var db = GetDbConnection(connection.Connection);
            await db.QueryAsync<SmsSent>(storeProcCommand, param);
        }

        public async Task DoveSoftDeliveryUpdateAsync(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate)
        {
            string storeProcCommand = "select sms_sent_dovesoftdeliveryupdate( @ResponseId, @IsDelivered, @NotDeliverStatus, @ReasonForNotDelivery, @DeliveryTime, @BouncedDate)";
            object? param = new { ResponseId, IsDelivered, NotDeliverStatus, ReasonForNotDelivery, DeliveryTime, BouncedDate };
            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> GetOpenAndClickedRate(string GroupIds)
        {
            string storeProcCommand = "select * from sms_sent_getdeliveredandclickedrate(@GroupIds)"; 
            object? param = new { GroupIds };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select   sms_sent_getconsumptioncount(@FromDateTime, @ToDateTime)"; 
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  UpdateOptOutByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId)
        {
            string storeProcCommand = "sms_sent_updateoptoutbyresponseid(@IsDelivered, @NotDeliverStatus, @DeliveryTime, @Operator, @Circle, @ReasonForNotDelivery, @ResponseId)"; 
            object? param = new { IsDelivered, NotDeliverStatus, DeliveryTime, Operator, Circle, ReasonForNotDelivery, ResponseId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<MLSmsCampaign>> GetSMSCampaignResponseData(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from sms_sent_getsmscampaignresponsedata(@SmsSendingSettingId)"; 
            object? param = new { SmsSendingSettingId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLSmsCampaign>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsSent>> ClickAsync(int SmsSendingSettingId, int ContactId, int WorkFlowId, string DeviceName, string DeviceType, string UserAgent, int TriggerMailSMSId = 0, string P5SMSUniqueID = null)
        {
            string storeProcCommand = "select * from sms_sent_click(@ContactId, @SmsSendingSettingId, @WorkFlowId, @DeviceName, @DeviceType, @UserAgent, @TriggerMailSMSId, @P5SMSUniqueID )"; 
            object? param = new { ContactId, SmsSendingSettingId, WorkFlowId, DeviceName, DeviceType, UserAgent, TriggerMailSMSId, P5SMSUniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsSent>(storeProcCommand, param);
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
