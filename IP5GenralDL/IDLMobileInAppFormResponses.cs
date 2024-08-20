using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppFormResponses : IDisposable
    {
        Task<List<MobileInAppFormResponses>> GetDetails(int OffSet, int FetchNext, DateTime? FromDate, DateTime? ToDate, int InAppCampaignId);
        Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int InAppCampaignId);
        Task<int> Save(MobileInAppFormResponses mobileInAppFormResponses);
        Task<int> SaveInappFormResponse(MobileInAppFormResponses mobileInAppFormResponses);
        Task<bool> UpdateIsNew(int Id, bool isNew);
    }
}