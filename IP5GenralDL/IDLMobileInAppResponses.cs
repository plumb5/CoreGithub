using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppResponses : IDisposable
    {
        Task<List<MobileInAppCampaign>> GetInAppResponsesReport(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null);
        Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null);
        Task<bool> InsertPushResponseView(string DeviceId, int InAppCampaignId = 0, string SessionId = null, string GeofenceName = null, string BeaconName = null);
        Task<bool> UpdatePushResponseClick(string DeviceId, int InAppCampaignId = 0);
        Task<bool> UpdatePushResponseClose(string DeviceId, int InAppCampaignId = 0);
    }
}