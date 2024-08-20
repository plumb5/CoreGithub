using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminUserDetails:IDisposable
    {
        Task<IEnumerable<MLAdminUserInfo>> GetAllUser(string UserIdList=null);
        Task<IEnumerable<MLAdminUserInfo>> SelectAllUsers();
    }
}
