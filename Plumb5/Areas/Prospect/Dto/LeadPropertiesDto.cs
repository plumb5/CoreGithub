using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LeadProperties_GetPropertySettingDto(int AccountId);
    public record LeadProperties_GetAllPropertyDto(int AccountId);
    public record LeadProperties_GetSelectedContactFieldDto(int AccountId);
    public record LeadProperties_SaveSettingPropertyDto(int AccountId, List<ContactFieldEditSetting> SettingList, List<int> DeleteIdList);
    public record LeadProperties_UpdateDisplayOrderDto(int AccountId, List<ContactFieldEditSetting> SettingList);
    public record LeadProperties_SaveupdateLmsheaderflagDto(int AccountId, bool headerflag);
    public record LeadProperties_GetLMSHeaderFlagDto(int AccountId);
    public record LeadProperties_UpdateIsSearchByColumnDto(ContactFieldProperty c, int AccountId);
    public record LeadProperties_UpdateIsPublisherFieldDto(ContactFieldProperty c, int AccountId);
    public record LeadProperties_GetMasterFilterColumnsDto(int AccountId);
}
