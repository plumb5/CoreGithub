using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsGroupImportRejectDetails:IDisposable
    {
        Task<Int32> Save(LmsGroupImportRejectDetails LmsGroupImportRejectDetails);
        Task<IEnumerable<LmsGroupImportRejectDetails>> GetList(LmsGroupImportRejectDetails LmsGroupImportRejectDetails, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
