using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebHookBulkSentInitiation:IDisposable
    {
        Task<IEnumerable<WorkFlowWebHookBulkSentInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(WorkFlowWebHookBulkSentInitiation BulkSentInitiation);
        Task<bool> ResetSentInitiation();
    }
}
