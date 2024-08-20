using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppSettings_SaveOrUpdateDto(int accountId, WhatsAppConfiguration WhatsAppConfigurationDetails, int WSPID, string ConfigurationName);
    public record WhatsAppSettings_GetAllDetailsDto(int accountId);
    public record WhatsAppSettings_DeleteWSPDto(int accountId);
    public record WhatsAppSettings_GetWhatsAppConfigurationDetailsDto(int accountId, int Id = 0);
    public record WhatsAppSettings_CheckWhatsAppSettingConfiguredDto(int accountId);
    public record WhatsAppSettings_GetConfigurationNamesDto(int accountId);
    public record WhatsAppSettings_ArchiveVendorDetailsDto(int accountId, int whatsappConfigurationNameId);
    public record WhatsAppSettings_GetConfigurationNamesListDto(int accountId);
    public record WhatsAppSettings_GetConfigurationNamesto(int accountId);
}
