using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsCampaign :IDisposable
    {
        Task<bool> Delete(int Id);
        Task<List<SmsCampaign>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName = null);
        Task<SmsCampaign?> GetDetail(SmsCampaign smsCampaign);
        Task<List<SmsCampaign>> GetDetails(SmsCampaign smsCampaign, int OffSet, int FetchNext);
        Task<int> MaxCount(SmsCampaign smsCampaign);
        Task<int> Save(SmsCampaign smsCampaign);
        Task<bool> Update(SmsCampaign smsCampaign);
    }
}