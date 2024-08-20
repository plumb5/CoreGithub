using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormResponseReportToSetting:IDisposable
    {
        Task<bool> Save(FormResponseReportToSetting responseSettings);
        Task<FormResponseReportToSetting?> Get(int FormId);
        Task<bool> Delete(Int32 FormId);

    }
}
