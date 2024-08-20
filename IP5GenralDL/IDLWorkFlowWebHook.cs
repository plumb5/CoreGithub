using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebHook : IDisposable
    {
        Task<int> Save(WorkFlowWebHook workFlowWebHook);
        Task<bool> Update(WorkFlowWebHook workFlowWebHook);
        Task<WorkFlowWebHook?> GetWebHookDetails(int ConfigureWebHookId);
        Task<WorkFlowWebHook?> GetCountsData(int ConfigureWebHookId, DateTime? FromDate = null, DateTime? ToDate = null);
    }
}
