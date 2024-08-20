using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminAccountDetails : IDisposable
    {
        Task<List<Account>> GetAllAccountDetails(int? Offset = 0, int? fetchnext = 0, short? AccountType = null, string AccountName = null, DateTime? CreatedFromDateTime = null, DateTime? CreatedTodateTime = null, DateTime? ExpiryFromDateTime = null, DateTime? ExpiryTodateTime = null, short? Status = null);
        Task<List<Account>> GetAccountDetailsByAccountType(short FeatureGroupId);
    }
}
