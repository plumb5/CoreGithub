using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record AgentNotificationDto_SaveLeadAssign(int AccountId, LeadNotification leadNotification);
    public record AgentNotificationDto_GetNotificationForLead(int AccountId);
}
