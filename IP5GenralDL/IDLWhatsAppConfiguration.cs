using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppConfiguration : IDisposable
    {
        Task<bool> ArchiveVendorDetails(int whatsappConfigurationNameId);
        Task<bool> Delete(int WSPID);
        Task<WhatsAppConfiguration?> GetConfigDetails();
        Task<WhatsAppConfiguration?> GetConfigurationDetails(int Id = 0);
        Task<WhatsAppConfiguration?> GetConfigurationDetailsForSending(int whatsappConfigurationNameId = 0, bool IsDefaultProvider = false, bool IsPromotionalOrTransactionalType = false);
        Task<List<WhatsAppConfiguration>> GetWhatsAppConfigurationDetails(WhatsAppConfiguration whatsappConfiguration);
        Task<List<MLWhatsAppConfiguration>> GETWSPCongigureDetails();
        Task<int> Save(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName = null);
        Task TruncateWSPDetails();
        Task<int> update(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName);
    }
}