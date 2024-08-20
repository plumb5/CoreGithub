using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAccount : IDisposable
    {
        Task<List<Account>> AccountByDomain(string domainName);
        Task<bool> AddWebPushSubDomain(int AccountId, string WebPushSubDomain);
        Task<bool> CheckWebPushSubDomain(string WebPushSubDomain);
        Task<bool> Delete(int AccountId);
        Task<Account?> GetAccountDetails(int AccountId);
        Task<List<Account>> GetAllAccount();
        Task<List<Account>> GetDetails(int UserInfoUserId);
        Task<int> SaveDetails(Account account);
        Task<bool> UpdateScript(int AccountId, string Script);
        Account? GetAccountDetailsData(int AccountId);
        Task<int> GetAllAccountCount();
    }
}
