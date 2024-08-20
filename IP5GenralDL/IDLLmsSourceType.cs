using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsSourceType : IDisposable
    {
        Task<Int32> Save(LmsSourceType LmsSourceType);
        Task<Int32> Update(LmsSourceType LmsSourceType);
        Task<List<LmsSourceType>> GetLmsSorceType();
    }
}
