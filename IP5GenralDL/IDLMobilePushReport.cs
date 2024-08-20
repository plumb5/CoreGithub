using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushReport : IDisposable
    {
        Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName);
        Task<List<MLMobilePushReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null);
    }
}
