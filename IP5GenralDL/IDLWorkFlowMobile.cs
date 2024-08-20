using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowMobile : IDisposable
    {
        Task<int> Save(MLWorkFlowMobile workFlowMobile);
        Task<bool> Update(MLWorkFlowMobile workFlowMobile);
        Task<AppPushCampaign?> GetDetails(int ConfigureMobileId);
        Task<MLWorkFlowMobile?> GetCountsData(int ConfigureMobileId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string DeviceId = null);
    }
}
