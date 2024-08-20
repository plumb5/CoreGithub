using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushGroupMembers : IDisposable
    {
        Task<Int64> AddToGroup(MobilePushGroupMembers mobilebPushGroupMembers);
        Task<bool> RemoveFromGroup(string[] deviceids, int GroupId);
        Task<long> GetUniqueDeviceId(string ListOfGroupId);
        Task<bool> MergeDistinctDeviceIdIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId);
        Task<List<MLMobileDeviceInfo>> GetGroupMobilePushInfoList(int GroupId);
        Task<List<Groups>> BelongToWhichGroup(string DeviceId);
    }
}
