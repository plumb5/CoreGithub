using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobileDeviceInfo:IDisposable
    {
        Task<Int32> MaxCount(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime);
        Task<IEnumerable<MobileDeviceInfo>> GetReportData(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
        Task<Int32> GetGroupMaxCount(MobileDeviceInfo mobPushUser, int GroupId);
        Task<IEnumerable<MobileDeviceInfo>> GetGroupDetails(MobileDeviceInfo mobPushUser, int Offset, int FetchNext, int GroupId);
        Task<MLMobileDeviceInfo?> GetMobileDeviceInfo(MobileDeviceInfo mobilePushInfo);

    }
}
