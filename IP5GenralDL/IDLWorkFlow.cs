using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlow : IDisposable
    {
        Task<int> Save(WorkFlow workFlow);
        Task<bool> Update(WorkFlow workFlow);
        Task<bool> UpdateStatus(int WorkFlowId, int Status, string UserName);
        Task<bool> UpdateLastupdateddata(WorkFlow workFlow);
        Task<WorkFlow?> GetDetails(WorkFlow workFlow);
        Task<int> CheckWorkflowTitle(WorkFlow workFlow);
        Task<bool> Delete(int WorkFlowId);
        Task<int> GetMaxCount(string WorkflowName = null);
        Task<List<WorkFlow>> GetListDetails(int OffSet, int FetchNext, string WorkflowName = null);
        Task<bool> UpdateErrorStatus(int WorkFlowId, int Status, string StoppedReason);

    }
}
