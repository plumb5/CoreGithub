using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppCampaignRules : IDisposable
    {
        Task<MobileInAppCampaignRules?> Get(int InAppCampaignId);
        Task<bool> Save(MobileInAppCampaignRules rulesData);
    }
}