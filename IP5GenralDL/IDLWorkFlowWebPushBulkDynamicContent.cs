using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebPushBulkDynamicContent:IDisposable
    {
        Task<IEnumerable<WorkFlowWebPushBulk>> GetBulkpushSendingSettingList(Int16 SendStatus);
        Task<IEnumerable<WorkFlowWebPushBulk>> GetDetailsForMessageUpdate(int WebPushSendingSettingId);
        void UpdateMessageContent(DataTable AllData);
        void DeleteMessageContent(DataTable AllData);
    }
}
