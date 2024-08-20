using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushSendingSetting : IDisposable
    {
        Task<Int32> Save(WebPushSendingSetting webPushSendingSetting);
        Task<bool> Update(WebPushSendingSetting webPushSendingSetting);
        Task<List<WebPushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null);
        Task<WebPushSendingSetting?> GetDetail(int Id);
        Task<bool> Delete(int Id);
        Task<int> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null);
        Task<bool> UpdateSentCount(int Id, int TotalSentCount, int TotalNotSentCount);
        Task<bool> UpdateSentCountAndNotSentCount(int Id, int TotalNotSentCount);
        Task<bool> CheckIdentifier(string IdentifierName);
        Task<bool> UpdateStoppedErrorStatus(WebPushSendingSetting webpushSendingSetting);
        Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForInterval();
        Task<List<WebPushSendingSetting>> GetRecentWebPushCampaignsForDailyOnce(int DaysLimit);
        Task UpdateWebPushCampaignSendStatus(int WebPushSendingSettingId);
    }
}
