using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserGroupMembers : IDisposable
    {
        Task<List<MLUserHierarchy>> GetHisUsers(int UserGroupId);
        Task<List<Members>> GetUserGroupMembers(List<int> ListofUserGroupMember);
        Task<int> AddToGroup(int UserInfoUserId, int UserGroupId);
        Task<bool> RemoveFromGroup(int UserInfoUserId, int UserGroupId);
    }
}
