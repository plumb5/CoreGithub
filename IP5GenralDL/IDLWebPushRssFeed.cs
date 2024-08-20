using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushRssFeed : IDisposable
    {
        Task<int> Save(WebPushRssFeed webPushRssFeed);
        Task<bool> Update(WebPushRssFeed webPushRssFeed);
        Task<int> MaxCount(DateTime FromDate, DateTime ToDate, string CampaignName = null);
        Task<List<WebPushRssFeed>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string CampaignName = null);
        Task<WebPushRssFeed?> GeDetails(WebPushRssFeed webPushRssFeed);
        Task<List<WebPushRssFeed>> GetFeedList();
        Task<bool> UpdatePublishedDate(WebPushRssFeed webPushRssFeed);
        Task<bool> UpdateDate(int Id);
        Task<bool> ChangeStatus(int Id, bool Status);
        Task<bool> Delete(int Id);
    }
}
