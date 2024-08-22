using P5GenralML;

namespace Plumb5.Dto
{
    public record Notifications_GetNotificationCountDto(int AccountId);
    public record Notifications_GetNotificationsDto(int AccountId);
    public record Notifications_UpdateSeenStatusDto(int AccountId, Notifications notifications); 

}
