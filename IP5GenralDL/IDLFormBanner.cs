using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormBanner : IDisposable
    {
        Task<Int32> Save(FormBanner formbanner);
        Task<bool> Update(FormBanner formbanner);
        Task<List<FormBanner>> GET(int FormId);
    }
}
