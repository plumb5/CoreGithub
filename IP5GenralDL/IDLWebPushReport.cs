using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushReport : IDisposable
    {
        Task<int> MaxCount(DateTime? FromDateTime, DateTime? ToDateTime, string CampaignName);
        Task<List<MLWebPushReport>> GetReportData(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext, string CampaignName = null);
        Task<List<MLWebPushCampaign>> GetWebPushCampaignResponseData(int webpushSendingSettingId);
    }
}
