using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLTotalVisitDetails:IDisposable
    {
        Task<Int32> GetTrackingVisitDetailsCount(DateTime FromDate, DateTime ToDate);
    }
}
