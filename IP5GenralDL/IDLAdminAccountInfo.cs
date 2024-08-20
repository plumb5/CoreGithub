using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminAccountInfo : IDisposable
    {
        Task<MLAdminUserInfo?> GetSupportManagerByAccountId(int AccountId);
        Task<MLAdminManagersName?> GetManagersNameByAccountId(int AccountId);
        Task<bool> StopStartAccount(int AccountId, int Status);
        Task<MLAdminUserInfo?> GetManagerByAccountId(int AccountId);
        Task<bool> UpdateAccountManager(int AccountId, int UserId, int SupportUserId);
        Task<long> SaveSupportAccountManagers(int AccountId, int accountmanager);
        Task<bool> AdminAccountsDelete(int AccountId);
        Task<int> SaveManagerDetails(MLAdminUserInfo addmanager);
        Task<int> DeleteManagerDetails(int Userid, int Role, int UpdateManagerRole);
        Task<List<MLAdminUserInfo>> GetManagerdetailsForDropdown();
        Task<int> UpdateMergeAccountSuportManager(int UserId);
        Task<int> ChangeManagerStatus(int userid, bool ActiveStatus);
        Task<List<MLAdminUserInfo>> GetManagerDetails(object Role);
        Task<MLAdminManagersDetails?> GetManagersDetailsByAccountId(int AccountId);
        Task<bool> UpdateAccountType(int AccountId, short AccountType);
        Task<bool> UpdateExpiryDate(int AccountId, DateTime ExpiryDate);
        Task<DataSet> GetManagerDetails(int userid, int supportuserid);
    }
}
