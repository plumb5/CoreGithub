using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowBulkSmsSent : IDisposable
    {
        Task<List<WorkFlowBulkSmsSent>> GetSendingSettingIds(WorkFlowBulkSmsSent smsSent);
        Task<List<WorkFlowBulkSmsSent>> GetDetailsForMessageUpdate(WorkFlowBulkSmsSent smsSent);
        Task<bool> UpdateMessageContent(DataTable AllMessageContent);
        Task<bool> DeleteUpdateMessageContent(DataTable AllMessageContent);
        Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId);
        Task<long> GetTotalBulkSms(int SmsSendingSettingId, int WorkFlowId);
    }
}
