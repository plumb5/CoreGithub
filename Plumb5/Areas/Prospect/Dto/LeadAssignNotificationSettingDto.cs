using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LeadAssignNotificationSetting_SaveLeadAssignmentAgentNotificationDto(int AccountId, LeadAssignmentAgentNotification leadAssignmentAgentNotification);
    public record LeadAssignNotificationSetting_GetLeadAssignmentAgentNotificationDto(int AccountId);
}
