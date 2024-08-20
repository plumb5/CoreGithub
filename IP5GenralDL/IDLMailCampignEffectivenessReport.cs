using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailCampignEffectivenessReport : IDisposable
    {
        Task<int> MaxCount(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport);
        Task<List<MLMailCampaignEffectivenessReport>> GetReportDetails(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport, int OffSet, int FetchNext);
    }
}
