using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPurgeSettings : IDisposable
    {
        Task<Int32> Save(PurgeSettings PurgeSettings);
        Task<Int32> Update(PurgeSettings PurgeSettings);
        Task<List<PurgeSettings>> GetPurgeSettings(int accountId);
    }
}
