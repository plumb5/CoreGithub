using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebPushBulkSent
    {
        Task<bool> DeleteTotalBulkPush(int WebPushSendingSettingId);
        Task<List<WebPushSendingSetting>> GetBulkWebPushSendingSettingList(int SendStatus);
        Task<List<WebPushSent>> GetBulkWebPushSentDetails(int WebPushSendingSettingId, int MaxLimit);
        Task<long> GetTotalBulkPush(int WebPushSendingSettingId);
        Task<bool> UpdateBulkWebPushSentDetails(List<long> WebPushBulkSentIds);
    }
}