using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppBulkSent:IDisposable
    {
        Task<IEnumerable<MLWhatsappSent>> GetBulkWhatsappSentDetails(int WhatsappSendingSettingId, int MaxLimit);
        Task<bool> UpdateBulkWhatsappSentDetails(List<long> WhatsappBulkSentIds);
        Task<long> GetTotalBulkWhatsapp(int WhatsappSendingSettingId);
        Task<bool> DeleteTotalBulkWhatsapp(int WhatsappSendingSettingId);
    }
}
