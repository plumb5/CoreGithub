using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadUnSeen:IDisposable
    {
        Task<Int32> LeadUnSeenMaxCount();
    }
}
