using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppIndividualResponse_IndividualMaxCountDto(int AdsId, string fromDateTime, string toDateTime, int WATemplateId = 0, string PhoneNumber = null);
    public record WhatsAppIndividualResponse_GetIndividualResponseDataDto(int AdsId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, int WATemplateId = 0, string PhoneNumber = null);
    public record WhatsAppIndividualResponse_ExportWhatsAppAlertNotificationDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
