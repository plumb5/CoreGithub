using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobileEventSetting:IDisposable
    {
        Task<Int32> Save(MobileEventSetting mobileEventSetting);
        Task<bool> Update(MobileEventSetting mobileEventSetting);
        Task<bool> Delete(int Id);
        Task<Int32> GetMaxCount(MobileEventSetting mobileEventSetting);
        Task<IEnumerable<MobileEventSetting>> GetList(MobileEventSetting mobileEventSetting, int OffSet, int FetchNext);
    }
}
