using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record SmsSettings_SaveOrUpdateDto(int accountId, SmsConfiguration[] smsConfigurationData, string ConfigurationName = null, int SmsConfigurationNameID = 0);
    public record SmsSettings_GetSmsConfigurationDetailsDto(int accountId);
    public record SmsSettings_ShowApiKeysDto(bool IsPromtionalTransactionsl);
    public record SmsSettings_DeleteVendorDetailsDto(int accountId);
    public record SmsSettings_GetSmsConfigurationsDto(int accountId, int smsConfigurationNameID = 0);
    public record SmsSettings_CheckSmsSettingConfiguredDto(int accountId);
    public record SmsSettings_ValidateSettingsDto(int accountId, int smsConfigurationNameId = 0);
    public record SmsSettings_ArchiveVendorDetailsDto(int accountId, int smsConfigurationNameId);
    public record SmsSettings_GetConfigurationNamesDto(int accountId);
    public record SmsSettings_GetConfigurationNameListDto(int accountId);


}
