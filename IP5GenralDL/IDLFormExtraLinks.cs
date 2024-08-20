using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormExtraLinks:IDisposable
    {
        Task<Int16> Save(FormExtraLinks formExtraLinks);
        Task<bool> Update(FormExtraLinks formExtraLinks);
        Task<bool> Delete(Int16 Id);
        Task<List<FormExtraLinks>> GET(bool? ToogleStatus = null);
        Task<bool> ToogleStatus(FormExtraLinks formExtraLinks);
    }
}
