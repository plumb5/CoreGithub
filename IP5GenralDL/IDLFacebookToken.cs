using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFacebookToken : IDisposable
    {
        Task<Int32> Save(FacebookToken fbToken);
        Task<FacebookToken?> Get();
        Task<bool> DeleteToken();
    }
}
