using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record InactiveNotification_GetInactiveNotificationDto(int AdsId);
    public record InactiveNotification_StoreInactiveNotificationDto(int AdsId, ContactInactiveNotification lmsNotification);
}
