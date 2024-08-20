using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailScheduledReport : IDisposable
    {
        Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null);
        Task<List<MLMailScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null);
        Task<bool> Delete(Int32 Id);
    }
}
