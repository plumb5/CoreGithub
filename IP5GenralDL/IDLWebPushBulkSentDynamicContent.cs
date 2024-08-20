using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLWebPushBulkSentDynamicContent
    {
        Task DeleteMessageContent(DataTable AllData);
        Task<List<WebPushSendingSetting>> GetBulkpushSendingSettingList(int SendStatus);
        Task<List<WebPushBulkSent>> GetDetailsForMessageUpdate(int WebPushSendingSettingId);
        Task UpdateMessageContent(DataTable AllData);
    }
}