using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserSession : IDisposable
    {
        Task<Int32> Save(UserSession UserSession);
        Task<UserSession?> Get(UserSession UserSession);
    }
}
