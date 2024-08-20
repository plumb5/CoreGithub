using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Preference.Dto
{
    public record SmsNotification_GetMaxCountDto(int AdsId);
    public record SmsNotification_GetTemplateListDto(int AdsId, int OffSet, int FetchNext);
    public record SmsNotification_GetByIdDto(int AdsId, int Id);
    public record SmsNotification_UpdateDto(int AdsId, SmsNotificationTemplate notificationTemplate);
    public record SmsNotification_UpdateStatusDto(int AdsId, bool IsSmsNotificationEnabled);
    public record SmsNotification_SendIndividualTestSMSDto(int accountId, int SmsNotificationTempId, string PhoneNumber, bool IsPromotionalOrTransactionalType, string VendorRegisteredTemplateId, string MessageContentData = null);


}
