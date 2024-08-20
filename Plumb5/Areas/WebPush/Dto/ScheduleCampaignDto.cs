using P5GenralML;

namespace Plumb5.Areas.WebPush.Dto
{
    public record ScheduleCampaign_GetUniqueMachineIdDto(string ListOfGroupId);
    public record ScheduleCampaign_CheckIdentifierUniquenessDto(string IdentifierName);
    public record ScheduleCampaign_GroupCreateAndMergeMachineIdDto(string ListOfGroupId, Groups groupDetails);
    public record ScheduleCampaign_SaveOrUpdateSendingSettingDto(int AccountId, WebPushSendingSetting webpushSendingSetting);
    public record ScheduleCampaign_GetMaxCountDto(string fromDateTime, string toDateTime);
    public record ScheduleCampaign_GetCampaignResponsesDto(int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record ScheduleCampaign_SendIndividualTestDto(int WebpushTemplateId, string MachineId);
    public record ScheduleCampaign_SendGroupTestDto(WebPushSendingSetting webpushSendingSetting);
    public record ScheduleCampaign_GetWebPushSendingSettingDetailsDto(int Id);
    public record ScheduleCampaign_CheckCreditsDto(int accountId, int TotalContacts);
}
