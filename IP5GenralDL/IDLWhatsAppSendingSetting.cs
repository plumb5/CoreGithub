using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppSendingSetting : IDisposable
    {
        Task<bool> UpdateSentCount(int whatsAppSendingSettingId, int TotalSentCount, int TotalNotSentCount);
        Task<WhatsAppSendingSetting?> Get(int whatsAppSendingSettingId);
        Task<List<WhatsAppSendingSetting>> GetListforapi(int whatsAppSendingSettingId);
        Task<bool> CheckIdentifier(string IdentifierName);
        Task<int> Save(WhatsAppSendingSetting whatsappSendingSetting);
        Task<List<WhatsAppSendingSetting>> GetRecentwhatsappCampaignsForDailyOnce(int DaysLimit);
        Task<List<WhatsAppSendingSetting>> GetRecentWhatsappCampaignsForInterval();
        Task UpdatewhatsappCamapignSentStatus(int whatsAppSendingSettingId);
        Task<bool> Delete(int whatsAppSendingSettingId);
        Task<bool> UpdateScheduledCampaign(WhatsAppSendingSetting whatsappSendingSetting);
        Task<Int32> SaveForForms(WhatsAppSendingSetting whatsappSendingSetting);
        Task<bool> UpdateStoppedErrorStatus(WhatsAppSendingSetting whatsappSendingSetting);
        Task<bool> Update(WhatsAppSendingSetting whatsappSendingSetting);
    }
}
