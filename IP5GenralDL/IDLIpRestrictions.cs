using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLIpRestrictions:IDisposable
    {
        Task<Int32> SaveAndUpdate(IpRestrictions IpRestrictions);
        Task<IpRestrictions> GetIpRestrictions();
    }
}
