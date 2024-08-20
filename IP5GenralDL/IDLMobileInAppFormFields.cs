using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppFormFields : IDisposable
    {
        Task<bool> Delete(short Id);
        Task<bool> DeleteFields(int InAppCampaignId);
        Task<List<MobileInAppFormFields>> GET();
        Task<List<MobileInAppFormFields>> GET(int InAppCampaignId);
        Task<short> Save(MobileInAppFormFields inAppFormFields);
        Task<bool> Update(MobileInAppFormFields inAppFormFields);
    }
}