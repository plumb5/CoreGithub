using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadScoring:IDisposable
    {
        Task<Int32> Save(LeadScoring leadScoring, string Action);
        Task<LeadScoring?> GetDetails();
    }
}
