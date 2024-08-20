using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserDetails : IDisposable
    {
        Task<UserInfo?> UserById(UserDetails MlObj);
        Task<List<UserDetail>> UsersbyMainUserId(UserDetails MlObj);
        Task<List<UserDetailswithSenior>> UserDetailswithSenior(UserDetails MlObj);
        Task SaveCreatedUserInfo(UserDetails MlObj);
        Task<bool> DeleteUser(UserDetails MlObj);
        Task<List<MLUserHierarchy>> GetUsersByHierarchy(UserDetails MlObj);
        Task<List<MLUserHierarchy>> GetUsersByGroups(UserDetails MlObj);
        Task<List<UserAccounts>> GetUsersAccount(UserDetails MlObj);
        Task<UserDetails?> Get(int UserInfoUserId);
        Task<int> InsertHierarchy(UserDetails MlObj);
        Task<MLUserHierarchy?> GetUsersHierarchyByUserId(UserDetails MlObj);
        Task<List<UserAccounts>> GetUsersAccountbyUserId(UserDetails MlObj);
        Task<int> DeleteHierarchy(UserDetails MlObj);
        Task<List<MLUserGroup>> GetUsersGroup(int UserId);
        Task<List<UserDetails>> GetUsersByCreatedUserId(int CreatedByUserId);
        Task<List<P5GenralML.MLUserHierarchyWithPermissions>> GetUserDetails(int UserId, int UserGroupId, UserDetailsHierarchyWithPermissions userDetailsWithPermissions);
    }
}
