using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminUserAccounts : IDisposable
    {
        Task<List<AdminUserAccounts>> GetDetails(List<int> Users);
    }
}
