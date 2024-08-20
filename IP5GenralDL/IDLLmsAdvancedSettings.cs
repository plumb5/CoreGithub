using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsAdvancedSettings : IDisposable
    {
        Task<Int32> saveupdate(MLLmsAdvancedSettings MLLmsAdvancedSettings);
        Task<List<MLLmsAdvancedSettings>> GetDetailsAdvancedSettings(string key);
    }
}
