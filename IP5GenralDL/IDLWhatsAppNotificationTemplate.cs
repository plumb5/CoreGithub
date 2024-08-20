using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppNotificationTemplate : IDisposable
    {
        Task<List<WhatsAppNotificationTemplate>> Get(int OffSet, int FetchNext);
        Task<WhatsAppNotificationTemplate?> GetById(int Id);
        Task<WhatsAppNotificationTemplate?> GetByIdentifier(string Identifier);
        Task<int> GetMaxCount();
        Task<bool> Update(WhatsAppNotificationTemplate notificationTemplate);
        Task<bool> UpdateStatus(bool IsWhatsAppNotificationEnabled);
    }
}