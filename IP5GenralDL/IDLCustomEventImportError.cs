using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventImportError : IDisposable
    {
        Task<int> Save(CustomEventImportError eventError);
        Task<List<CustomEventImportError>> GetList(int EventImportOverViewId, int OffSet = 0, int FetchNext = 0);
    }
}
