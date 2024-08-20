using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAccountNew : IDisposable
    {
        Task<object?> GetIncludeExcludedInfo(_Plumb5IncludeExclude mLAccount);
        Task<int> SaveIncludeExclude(_Plumb5IncludeExclude mLAccount);
        Task<DataSet> SelectApikey(int UserId);
        Task<long> UpdateApikey(int UserId, string Apikey);
        Task<object?> GetNotification(int UserId);
        Task<int> GetConnectionstrng(int UserId, string connectionForLeadsCnt);
    }
}
