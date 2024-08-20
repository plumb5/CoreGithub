using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsConfiguration : IDisposable
    {
        Task<bool> ArchiveVendorDetails(int smsConfigurationNameId);
        Task<bool> ChangeDefaultConfig(SmsConfiguration smsConfiguration);
        Task<SmsConfiguration?> GetActive();
        Task<List<MLSmsConfiguration>> GetConfigurationDetails();
        Task<SmsConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool IsDefaultProvider = false, int SmsConfigurationNameId = 0);
        Task<SmsConfiguration?> GetDoveSoftProvider(bool IsPromotionalOrTransactionalType);
        Task<SmsConfiguration?> GetPromotionalDetails(SmsConfiguration smsConfiguration);
        Task<List<SmsConfiguration>> GetSmsConfigurationDetails(SmsConfiguration smsConfiguration);
        Task<SmsConfiguration?> GetTimeRestrictionData();
        Task<SmsConfiguration?> GetTransactionalDetails(SmsConfiguration smsConfiguration);
        Task<int> Save(SmsConfiguration smsConfiguration, string ConfigurationName = null);
        Task<bool> ToogleStatus(SmsConfiguration mailConfiguration);
        Task TruncateSmsDetails();
        Task<bool> Update(SmsConfiguration smsConfiguration);
        Task<int> Update(SmsConfiguration smsConfiguration, string ConfigurationName);
        Task<bool> UpdateGovernanceConfiguration(SmsConfiguration governanceConfiguration);
    }
}