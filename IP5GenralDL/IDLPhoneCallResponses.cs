using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPhoneCallResponses:IDisposable
    {
        Task<Int32> Save(PhoneCallResponses phoneCallResponses);
        Task<Int32> Update(PhoneCallResponses phoneCallResponses);
        Task<IEnumerable<PhoneCallResponses>> GetDetails(PhoneCallResponses phoneCallResponses);
    }
}
