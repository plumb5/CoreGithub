using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWebPushBulkInitiation:IDisposable
    {
        Task<IEnumerable<WorkFlowWebPushBulkInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(WorkFlowWebPushBulkInitiation BulkSentInitiation);
        Task<bool> ResetSentInitiation();
        Task<Int32> Save(WorkFlowWebPushBulkInitiation BulkSentInitiation);
    }
}
