using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsBulkSentDynamicContent:IDisposable
    {
        Task<IEnumerable<SmsSendingSetting>> GetBulkSmsSendingSettingList(Int16 SendStatus);
        Task<IEnumerable<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId);
        void UpdateMessageContent(DataTable AllData);
        void DeleteMessageContent(DataTable AllData);

    }
}
