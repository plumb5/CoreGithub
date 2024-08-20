using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserInfo : IDisposable
    {
        Task<Int32> SaveDetails(UserInfo userInfo);
        Task<bool> UpdateDetails(UserInfo userInfo);
        Task<UserInfo?> GetDetail(string emailId);
        Task<UserInfo?> GetDetail(int UserId);
        UserInfo? GetDetailData(int UserId);
        Task<UserInfo?> GetDetailByAPIKey(string apikey);
        List<UserInfo> GetDetail(IEnumerable<int> Users);
        Task<bool> Delete(int UserId);
        Task<int> MainUserId(int UserId);
        Task<bool> ToogleStatus(int UserId, bool ActiveStatus);
        Task<List<Groups>> Groups(int UserId);
        Task<List<Groups>> GroupsbyAccountId(int UserId, int AccountId);
        Task<bool> UpdateFirstTimePasswordReset(int UserId, string NewPassword);
        Task<bool> UpdateOtp(int UserId, string Otp);
        Task<List<UserInfo>> GetList();
        Task<List<MLUserInfo>> GetCredentials(int AccountId);
        Task<List<MLUserDetails>> GetAllUsersbyUserId(int UserId, int AccountId);
        Task<List<MLUserInfo>> GetUserDetails(int UserId, string EmailId, int OffSet, int FetchNext, int UserGroupId);
        Task<UserInfo?> GetDetailByPhone(string mobilePhone);
        Task<bool> DeleteUserDetailsByAccountId(int AccountId);
        Task<bool> UpdatePreferredAccountId(int PreferredAccountId, int UserId);
        Task<bool> UpdateUserLastActiveDateTime(int UserId);
        Task<List<UserInfo>> GetAllActiveUserDetails();
        Task<UserInfo?> CheckAssignedUserIsActive(int UserId);
    }
}
