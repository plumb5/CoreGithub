using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPhoneCallCallerIdExtension:IDisposable
    {
        Task<Int32> Save(PhoneCallCallerIdExtension PhoneCallCallerIdExtension);
        Task<IEnumerable<PhoneCallCallerIdExtension>> GetList();
        Task<PhoneCallCallerIdExtension?> GetByPhone(string PhoneNumber);
        Task<bool> DeleteAll();
        Task<bool> DeleteByCallerIdValue(int Id);
    }
}
