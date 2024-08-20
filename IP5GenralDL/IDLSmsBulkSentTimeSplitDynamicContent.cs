using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLSmsBulkSentTimeSplitDynamicContent
    {
        void DeleteMessageContent(DataTable AllData);
        Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(short SendStatus);
        Task<List<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId);
        void UpdateMessageContent(DataTable AllData);
    }
}