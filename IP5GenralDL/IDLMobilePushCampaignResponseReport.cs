using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushCampaignResponseReport : IDisposable
    {
        Task<int> MaxCount(MLMobilePushCampaignResponseReport mobpushReport, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLMobilePushCampaignResponseReport>> GetReportDetails(MLMobilePushCampaignResponseReport mobpushReport, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
