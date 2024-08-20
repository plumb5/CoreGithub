using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsReport : IDisposable
    {
        Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName, string TemplateName);
        Task<List<MLSmsReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null, string TemplateName = null);
    }
}
