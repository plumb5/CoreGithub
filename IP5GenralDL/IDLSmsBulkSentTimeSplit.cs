using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsBulkSentTimeSplit
    {
        Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId);
        Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(byte SendStatus);
        Task<List<SmsSent>> GetSMSSentContacts(int SmsSendingSettingId, int MaxLimit);
        Task<long> GetTotalBulkSms(int SmsSendingSettingId);
        Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds);
    }
}