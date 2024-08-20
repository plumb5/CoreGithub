using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushGroupMembers : IDisposable
    {
        Task<long> GetUniqueMachineId(string ListOfGroupId);
        Task<bool> MergeDistinctMachineIdIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId);
        Task<List<WebPushUser>> GetGroupWebPushInfoList(int GroupId);
        Task<Int64> AddToGroup(WebPushGroupMembers webPushGroupMembers);
        Task<bool> RemoveFromGroup(string[] machineids, int GroupId);
        Task<List<Groups>> BelongToWhichGroup(string MachineId);
    }
}
