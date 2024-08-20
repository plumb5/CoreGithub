using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppCampaign : IDisposable
    {
        Task<bool> ChangePriority(int Id, int Priority);
        Task<bool> Delete(int Id);
        Task<List<MobileInAppCampaign>> GetAllActiveInAppCampaignsList(string DeviceId);
        Task<List<MobileInAppCampaign>> GetAllInAppCampaigns(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null);
        Task<MobileInAppCampaign?> GetDetail(int Id);
        Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null);
        Task<List<MobileInAppCampaign>> GetMobileInAppCampaign();
        Task<List<MobileInAppCampaign>> GetMobileInAppFormCampaign();
        Task<int> Save(MobileInAppCampaign inappCampaign);
        Task<bool> ToogleCampaignStatus(MobileInAppCampaign inappCampaign);
        Task<bool> Update(MobileInAppCampaign inappCampaign);
    }
}