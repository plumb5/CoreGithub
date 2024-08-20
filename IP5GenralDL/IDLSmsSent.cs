using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsSent:IDisposable
    {
        Task<Int32> Save(SmsSent smsSent);
        Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery);
        Task<SmsSent?> Deliverd(int SmsSendingSettingId, Int16 IsDelivered, short NotDeliverStatus, string PhoneNumber, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, int WorkFlowId = 0);
        Task<SmsSent?> Click(int SmsSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, int TriggerMailSMSId = 0);
        Task<bool> UpdateVerification(int ContactId, int IsVerifiedContactNumber);
        Task<bool> UpdateVerification(string PhoneNumber, int IsVerifiedContactNumber);
        Task<MLSmsSentStatusReport?> GetSmsStatusCount(int SmsSendingSettingId);
        Task<bool> Update(SmsSent SmsSent);
        Task<IEnumerable<GroupMember>> GetContactIdList(int[] SmsSendingSettingIdList, int[] CampaignResponseValue);
        Task<Int32> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, string Phonenumber);
        Task<IEnumerable<MLSmsSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Phonenumber);
        Task<bool> SaveWorkFlowBulk(DataTable smsSentBulk);
        Task<bool> UpdateTotalCounts(DataTable smsSentBulk, int SmsSendingSettingId);
        Task<bool> DeleteFromWorkFlowBulkSmsSent(DataTable smsSentBulk);
        Task<bool> DeleteSentSmsBulk(DataTable smsSentBulk);
        Task<bool> SaveBulkSmsResponsesForCampaign(DataTable smsSentBulk);
        Task<bool> DeliverdByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId);
        Task<bool> SmsDeliveryException(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId, string SqlException);
        Task<bool> DeleteResponsesFromBulkCampaign(DataTable smsSentBulk);
        void UpdateBulkSmsResponsesForCampaign(DataTable smsSentBulk);
        void AclMobileDeliveryUpdate(string PhoneNumber, string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime DeliveryTime);
        Task<Int32> GetNonDeliveredContactsCount(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType);
        Task<IEnumerable<SmsSent>> GetNonDeliveredContacts(string VendorName, DateTime SmsSentFromDate, DateTime SmsSentToDate, bool IsPromotionalOrTransactionalType, int OffSet, int FetchNext);
        void DoveSoftDeliveryUpdate(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate);
        Task DoveSoftDeliveryUpdateAsync(string ResponseId, byte IsDelivered, short NotDeliverStatus, string ReasonForNotDelivery, DateTime? DeliveryTime, DateTime? BouncedDate);
        Task<DataSet> GetOpenAndClickedRate(string GroupIds);
        Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<bool> UpdateOptOutByResponseId(Int16 IsDelivered, short NotDeliverStatus, DateTime DeliveryTime, string Operator, string Circle, string ReasonForNotDelivery, string ResponseId);
        Task<IEnumerable<MLSmsCampaign>> GetSMSCampaignResponseData(int SmsSendingSettingId);
        Task<IEnumerable<SmsSent>> ClickAsync(int SmsSendingSettingId, int ContactId, int WorkFlowId, string DeviceName, string DeviceType, string UserAgent, int TriggerMailSMSId = 0, string P5SMSUniqueID = null);
    }
}
