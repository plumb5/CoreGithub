using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppReport_MaxCountDto(int accountId, MLWhatsAppReportDetails sentContactDetails, string fromDateTime, string toDateTime);
    public record WhatsAppReport_GetReportDetailsDto(int accountId, MLWhatsAppReportDetails sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record WhatsAppReport_GetMaxClickCountDto(int accountId, MLWhatsAppReportDetails sentContactDetails, string fromDateTime, string toDateTime);
    public record WhatsAppReport_GetClickReportDetailsDto(int accountId, MLWhatsAppReportDetails sentContactDetails, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record WhatsAppReport_ExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
    public record WhatsAppReport_ExportClickReportDto(int AccountId, string FileType, string requireddata, int OffSet, int FetchNext);
}
