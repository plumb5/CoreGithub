using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebPushBulk:IDisposable
    {
        Task<IEnumerable<WebPushSent>> GetBulkDetails(WorkFlowWebPushBulk webPushSent, int MaxCount);
        Task<bool> UpdateSendingMachineIdStatus(List<Int64> WorkFlowBrowserPushBulkIds);
        Task<bool> DeleteFromWorkFlowBulkWebPushSent(List<Int64> WebPushSentBulkids);
        Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId);
        Task<long> GetTotalBulkPush(int ConfigureWebPushId, int WorkFlowDataId, int WorkFlowId);
    }
}
