using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Preference.Dto
{
    public record WhatsAppNotification_GetMaxCountDto(int AdsId);
    public record WhatsAppNotification_GetTemplateListDto(int AdsId, int OffSet, int FetchNext);
    public record WhatsAppNotification_GetByIdDto(int AdsId, int Id);
    public record WhatsAppNotification_UpdateDto(int AdsId, WhatsAppNotificationTemplate notificationTemplate);
    public record WhatsAppNotification_UpdateStatusDto(int AdsId, bool IsWhatsAppNotificationEnabled);
}
