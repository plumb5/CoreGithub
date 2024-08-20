using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserInValidLogin : IDisposable
    {
        Task<UserInValidLogin?> Save(UserInValidLogin userInValidLogin);
        Task<UserInValidLogin?> GetDetail(UserInValidLogin userInValidLogin);
        Task<bool> Delete(int UserInfoUserId);
    }
}
