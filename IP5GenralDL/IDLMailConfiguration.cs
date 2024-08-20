using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailConfiguration : IDisposable
    {
        Task<bool> ArchiveVendorDetails(int whatsappConfigurationNameId);
        Task<bool> DeleteServiceProvider(string ProviderName);
        Task<List<MLMailConfiguration>> GetAllServiceProviderlDetails();
        Task<MailConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool IsDefaultProvider = false, int MailConfigurationNameId = 0);
        Task<List<MailConfiguration>> GetDetails(MailConfiguration mailConfiguration);
        Task<List<MailConfiguration>> GetDetailsByProviderName(string ProviderName);
        Task<MailConfiguration?> GetPromotionalDetails(MailConfiguration mailConfiguration);
        Task<List<MailConfiguration>> GetProviderNameForDomainValidation();
        Task<List<MailConfiguration>> GetServiceProviderlDetails(int mailConfigurationNameID = 0);
        Task<MailConfiguration?> GetTransactionalDetails(MailConfiguration mailConfiguration);
        Task<List<MailConfiguration>> GetUnsubscribeUrlDetails();
        Task<int> Save(MailConfiguration mailConfiguration, string ConfigurationName = null);
        Task<bool> SaveUnsubscribeUrl(string UnsubscribeUrl);
        Task<bool> SaveUrl(string DomainForImage, string DomainForTracking);
        Task<bool> ToogleStatus(MailConfiguration mailConfiguration);
        Task TruncateMailDetails();
        Task<bool> Update(MailConfiguration mailConfiguration, string ConfigurationName = null);
        Task<bool> UpdateGovernanceConfiguration(MailConfiguration governanceConfiguration);
    }
}