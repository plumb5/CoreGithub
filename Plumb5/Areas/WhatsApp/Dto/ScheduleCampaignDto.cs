using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record ScheduleCampaign_GetWhatsAppSendingSettingDetailsDto(int accountId, int WhatsAppSendingSettingId);
    public record ScheduleCampaign_GetCampaignListDto(int accountId);
    public record ScheduleCampaign_GetGroupListDto(int accountId);
    public record ScheduleCampaign_GetTemplateListDto(int accountId);
    public record ScheduleCampaign_GetUniquePhoneContactDto(int accountId, string ListOfGroupId);
    public record ScheduleCampaign_CheckIdentifierUniquenessDto(int accountId, string IdentifierName);
    public record ScheduleCampaign_GetGroupAnalysisDetailsDto(int accountId, string GroupIds);
    public record ScheduleCampaign_GroupCreateAndMergeContactDto(int accountId, string ListOfGroupId, Groups groupDetailsData);
    public record ScheduleCampaign_SaveSingleScheduleWhatsAppDto(int accountId, WhatsAppSendingSettingDto whatsappSendingSettingData, string EditCopyAction);
    public record ScheduleCampaign_DeleteCampaignDto(int accountId, int WhatsAppSendingSettingId);
    public record ScheduleCampaign_CheckCreditsDto(int accountId, int TotalContacts);
}
