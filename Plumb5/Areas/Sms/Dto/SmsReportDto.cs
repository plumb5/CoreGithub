using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record SmsReportDto_MaxCount(int accountId, MLSmsReportDetails sentContactDetails, string fromDateTime, string toDateTime);
    public record SmsReportDto_GetReportDetails(int accountId, MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record SmsReportDto_GetMaxClickCount(int accountId, MLSmsReportDetails sentContactDetails, string fromDateTime, string toDateTime);
    public record SmsReportDto_GetClickReportDetails(int accountId, MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record SmsReportDto_GetSmsStatusCount(int SmsSendingSettingId);
    public record SmsReportDto_Export(int AccountId, int OffSet, int FetchNext, string FileType);
    public record SmsReportDto_GetProductDetailsById(string ProductIds);
    public record SmsReportDto_GetContactDetails(int contactId);
    public record SmsReportDto_GetBouncedDetails(int SMSSendingSettingId);
    public record SmsReportDto_ExportClickReport(int AccountId, string FileType, string requireddata, int OffSet, int FetchNext);
}
