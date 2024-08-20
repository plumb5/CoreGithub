using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record SettingsDto_GetStageScore(int AccountId);
    public record SettingsDto_DeleteStage(int AccountId, int lmsStageId);
    public record SettingsDto_GetUser(int AccountId, int UserId);
    public record SettingsDto_SaveOrUpdateUpdateStageDetails(int AccountId, LmsStage lmsStage, LmsStageNotification lmsStageNotification);
    public record SettingsDto_GetWhatsAppTemplateList(int accountId);
}
