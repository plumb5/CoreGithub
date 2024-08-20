using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsappBulkSentInitiation
    {
        Task<List<WhatsappBulkSentInitiation>> GetSentInitiation();
        Task<bool> ResetSentInitiation();
        Task<int> Save(WhatsappBulkSentInitiation BulkSentInitiation);
        Task<bool> UpdateSentInitiation(WhatsappBulkSentInitiation BulkSentInitiation);
    }
}