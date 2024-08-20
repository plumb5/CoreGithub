using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowMobileAppPushBulk : IDisposable
    {
        Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkflowId);
    }
}
