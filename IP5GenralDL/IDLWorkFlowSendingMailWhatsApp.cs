using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowSendingMailWhatsApp
    {
        Task<List<MLWhatsappSent>> GetWhatsAppBulkDetails(int WhatsAppSendingSettingId, int WorkFlowId, Int16 SendStatus, int MaxLimit);
    }
}
