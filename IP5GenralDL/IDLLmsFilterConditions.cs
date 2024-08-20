using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsFilterConditions:IDisposable
    {
        Task<Int32> Save(MLLmsFilterConditions filterCondition);
        Task<IEnumerable<MLLmsFilterConditions>> GetFilterName(string UserIdList, bool ShowInDashboard = false);
        Task<MLLmsFilterConditions?> GetFilterConditionDetails(int FilterConditionId);
        Task<MLLmsFilterConditions?> GetRecentSavedReportDetails(string UserIdList);
        Task<bool> Update(MLLmsFilterConditions filterCondition);
        Task<bool> DeleteSavedSearch(int Id);
    }
}
