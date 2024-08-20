namespace Plumb5.Areas.Sms.Dto
{
    public record SmsIndividualResponse_IndividualMaxCountDto(int AdsId, string fromDateTime, string toDateTime, string Phonenumber);
    public record SmsIndividualResponse_GetIndividualResponseDataDto(int AdsId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, string Phonenumber);
    public record SmsIndividualResponse_ExportSmsAlertNotificationDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
