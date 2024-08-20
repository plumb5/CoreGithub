using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailCampaignResponses : IDisposable
    {
        Task<List<MLMailCampaignResponses>> GetResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId, int mailTemplateId);
        Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId, int mailTemplateId);
        Task<List<MLMailCampaignResponses>> GetABTestingResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId);
        Task<int> ABTestingMaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId);
    }
}
