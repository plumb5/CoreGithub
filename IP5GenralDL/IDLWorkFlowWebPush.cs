using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebPush:IDisposable
    {
        Task<Int32>  Save(MLWorkFlowWebPush workFlowWebPush);
        Task<bool> Update(MLWorkFlowWebPush workFlowWebPush);
        Task<sendingDatalist?> GetDetails(int ConfigureWebPushId);
        Task<MLWorkFlowWebPush?> GetCountsData(int ConfigureWebPushId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string MachineId = null);
        Task<WorkFlowWebPush?> GetWebPushDetails(int ConfigureWebPushId);
        Task<IEnumerable<WorkFlowWebPush>> GetRecentWebPushCampaignsForInterval();
        void UpdateWebPushCampaignSendStatus(int workflowWebPushSendingSettingId);

    }
}
