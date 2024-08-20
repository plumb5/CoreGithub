using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAllConfigURLDetails : IDisposable
    {
        Task<List<AllConfigURL>> Get();
        Task<Int32> Save(AllConfigURL allConfigURL);
    }
}
