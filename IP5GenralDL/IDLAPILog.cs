using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAPILog : IDisposable
    {
        Task<Int32> Save(APILog ApiLog);
        Task<Int32> GetMaxCount(DateTime FromDate, DateTime ToDate);
        Task<IEnumerable<APILog>> GetAllDetails(DateTime FromDate, DateTime ToDate, int OffSet, int FetchNext);
    }
}
