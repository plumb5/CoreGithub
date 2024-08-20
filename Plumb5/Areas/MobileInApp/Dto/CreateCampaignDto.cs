using P5GenralML;

namespace Plumb5.Areas.MobileInApp.Dto
{
    public record CreateCampaign_GetCampaignList(int accountId);
    public record CreateCampaign_GetGroupList(int accountId, Groups group);
    public record CreateCampaign_SaveOrUpdate(int AccountId, MobileInAppCampaign mobileInAppCampaign, MobileInAppCampaignRules rulesData, String[][] CaptureFormFields);
    public record CreateCampaign_GetInAppCampaignDetails(int accountId, int InAppCampaignId);
}
