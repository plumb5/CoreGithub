using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowRule : IDisposable
    {
        Task<int> Save(WorkFlowSetRules setRule);
        Task<bool> Update(WorkFlowSetRules setRule);
        Task<WorkFlowSetRules?> GetDetails(WorkFlowSetRules setRule);
        Task<bool> Delete(Int32 RuleId);
        Task<bool> ToogleStatus(MLWorkFlowSetRules setRule);
        Task<int> GetMaxCount(string RuleName = null);
        Task<List<MLWorkFlowSetRules>> GetAllRules(int OffSet, int FetchNext, string RuleName = null);
        Task<List<MLWorkFlowSetRules>> GetAllRule();
    }
}
