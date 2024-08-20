using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventImportOverview:IDisposable
    {
        Task<Int32> Save(CustomEventImportOverview customEventImportOverview);
        Task<Int32> MaxCount(CustomEventImportOverview customEventImportOverview);
        Task<IEnumerable<CustomEventImportOverview>> GetReportData(CustomEventImportOverview customEventImportOverview, int OffSet, int FetchNext);
    }
}
