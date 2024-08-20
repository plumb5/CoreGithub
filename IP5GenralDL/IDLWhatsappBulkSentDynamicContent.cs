using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsappBulkSentDynamicContent:IDisposable
    {
        void DeleteMessageContent(DataTable AllData);
        Task<bool> UpdateMessageContent(DataTable AllMessageContent);
        Task<IEnumerable<WhatsappBulkSent>> GetDetailsForMessageUpdate(int WhatsappSendingSettingId);
        Task<IEnumerable<WhatsAppSendingSetting>> GetBulkAppSendingSettingList(int SendStatus);
        Task<WhatsAppSendingSetting?> GetDetail(int Id);
    }
}
