using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record AdvancedSettingsDto_SaveOrUpdate(MLLmsAdvancedSettings advancedsettings, int AccountId);
    public record AdvancedSettingsDto_GetLmAdvacedSettings(int accountId, string key);
}
