using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLCampaignIdentifier : IDisposable
    {
        Task<bool> Archive(int Id);
        Task<CampaignIdentifier?> Get(CampaignIdentifier identifier);
        Task<List<CampaignIdentifier>> GetAllCampaigns(IEnumerable<int> ListOfId);
        Task<List<CampaignIdentifier>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName = null);
        Task<List<CampaignIdentifier>> GetList(CampaignIdentifier identifier, int OffSet, int FetchNext);
        Task<int> MaxCount(CampaignIdentifier identifier);
        Task<int> Save(CampaignIdentifier identifier);
        Task<bool> ToogleStatus(CampaignIdentifier identifier);
        Task<bool> Update(CampaignIdentifier identifier);
    }
}