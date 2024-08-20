using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailSettings_GetFromEmailIdToBindDto(int accountId);
    public record MailSettings_SaveDto(int accountId, MailConfigForSending verifyfromEmailId);
    public record MailSettings_ChangeEditableStatusDto(int accountId, MailConfigForSending verifyfromEmailId);
    public record MailSettings_DeleteDto(int accountId, int Id);
    public record MailSettings_GetServiceProviderlDetailsDto(int accountId);
    public record MailSettings_ServiceProviderlDetailsDto(int accountId, int mailConfigurationNameID);
    public record MailSettings_SaveOrUpdate(int accountId, MailConfiguration ServiceProvicerData, string? ConfigurationName = null);
    public record MailSettings_GetDetailsByProviderName(int accountId, string ProviderName);
    public record MailSettings_BindApiKey(string ProviderType, int IsMasked);
    public record MailSettings_GetProviderNameForDomainValidation(int accountId);
    public record MailSettings_DeleteDomainInfo(int accountId, int Id);
    public record MailSettings_GetUnsubscribeUrlDetails(int accountId);
    public record MailSettings_SaveUnsubscribeUrl(int accountId, string UnsubscribeUrl);
    public record MailSettings_GetSpamScoreSettingDetails(int AdsId);
    public record MailSettings_SaveorUpdateSpamScore(int AdsId, MailSpamScoreVerifySetting ProviderSetting);
    public record MailSettings_SaveorUpdateEmailVerify(int AdsId, EmailVerifyProviderSetting ProviderSetting);
    public record MailSettings_ProviderValidate(int accountId, string ProviderName, string FromEmailId);
    public record MailSettings_CheckMailSettingConfigured(int accountId);
    public record MailSettings_ArchiveVendorDetails(int accountId, int mailConfigurationNameId);
}
