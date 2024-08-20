using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppCampaign:IDisposable
    {
        Task<bool> Delete(int Id);
        Task<List<WhatsAppCampaign>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName);
        Task<int> MaxCount(WhatsAppCampaign WhatsAppCampaign);
        Task<int> Save(WhatsAppCampaign WhatsAppCampaign);
        Task<bool> Update(WhatsAppCampaign WhatsAppCampaign);
    }
}