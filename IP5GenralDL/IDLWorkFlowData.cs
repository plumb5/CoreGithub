using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowData:IDisposable
    {
        Task<Int32> Save(WorkFlowData workFlowData);
        Task<bool> Delete(int WorkFlowId);
        Task<IEnumerable<WorkFlowData>> GetDetails(WorkFlowData workFlowData);
        Task<IEnumerable<WorkFlowData>> GetDetailsList(int WorkFlowId);
        Task<IEnumerable<WorkFlowData>> GetruleforEdit(int WorkflowId);
        Task<IEnumerable<WorkFlowData>> GetConfigDetail(int WorkFlowId);
        Task<IEnumerable<WorkFlowData>> GetConfigDetailByWorkFlowId(int WorkFlowId);
        Task<IEnumerable<WorkFlowData>> GetDateandTime(int WorkFlowId, string NodeId);
        Task<bool> UpdateDateandTime(WorkFlowData workFlowData);
        Task<bool> UpdateGroupsIndividual(WorkFlowData workFlowData);
        Task<Int32> GetTempId(string Action, WorkFlowData workflow);

    }
}
