using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadScoreThresholdSettings:IDisposable
    {
        Task<IEnumerable<LeadScoreThresholdSettings>> GetList();
        void UpdateLeadBasedOnScore(LeadScoreThresholdSettings thresholdSettings);
        Task<Int32> Save(LeadScoreThresholdSettings thresholdSettings);
        Task<bool> Delete(int id = 0);
    }
}
