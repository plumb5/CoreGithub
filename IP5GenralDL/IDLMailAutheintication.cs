using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailAutheintication : IDisposable
    {
        Task<bool> UPDATE(MLMailAutheintication Data);
        Task<List<MLMailAutheintication>> GET(MLMailAutheintication Data);
        Task<bool> Delete(int Id);
        Task<MLMailAutheintication?> GetDetails(int Id);

        List<MLMailAutheintication> GETDATA(MLMailAutheintication Data);
    }
}
