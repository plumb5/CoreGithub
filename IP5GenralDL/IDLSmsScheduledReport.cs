using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsScheduledReport:IDisposable
    {
        Task<Int32> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampignName = null);
        Task<IEnumerable<MLSmsScheduled>> GetScheduled(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, List<string> fieldsName = null, string CampignName = null);
        Task<IEnumerable<MLSmsScheduled>> GetScheduledDetailbyId(int SmsSendingSettingId);
    }
}
