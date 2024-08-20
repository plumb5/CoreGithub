using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowBulkWhatsAppSent:IDisposable
    {
        Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId);
        Task<long> GetTotalBulkWhatsApp(int WhatsAppSendingSettingId, int WorkFlowId);
        Task<IEnumerable<WorkFlowBulkWhatsAppSent>> GetDetailsForMessageUpdate(WorkFlowBulkWhatsAppSent whatsAppSent);
        Task<IEnumerable<WorkFlowBulkWhatsAppSent>> GetSendingSettingIds(WorkFlowBulkWhatsAppSent whatsAppSent);
        void UpdateMessageContent(DataTable AllData);
        void DeleteMessageContent(DataTable AllData);

    }
}
