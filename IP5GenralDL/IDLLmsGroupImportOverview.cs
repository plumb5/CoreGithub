using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsGroupImportOverview:IDisposable
    {
        Task<Int32> Save(LmsGroupImportOverview groupImportOverview);
        Task<IEnumerable<LmsGroupImportOverview>> GetList(LmsGroupImportOverview groupImportOverview, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
