using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserHierarchy : IDisposable
    {
        Task<Int32> Save(UserHierarchy userHierarchy);
        Task<List<MLUserHierarchy>> GetHisUsers(int UserId, int AccountId, int Getallusers = 0);
        Task<List<MLUserHierarchy>> GetHisUsers(int UserId);
        Task<MLUserHierarchy?> GetUsersSenior(int UserInfoUserId);
        Task<MLUserHierarchy?> GetHisDetails(int UserInfoUserId);
        Task<UserHierarchy?> GetHisRole(int UserInfoUserId);
        Task<bool> DeleteUserHierarchyByAccountId(int AccountId);
        Task<List<MLUserHierarchy>> GetUsersBySeniorIdForTree(int UserInfoUserId);
        Task<List<UserHierarchy>> GetPermissionUsers(int UserId);
    }
}
