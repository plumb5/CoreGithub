using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppDashboard_GetCampaignEffectivenessDataDto(int accountId, string fromdate, string todate);
    public record WhatsAppDashboard_GetWhatsAppDashboardSubcribersDataDto(int accountId, string fromdate, string todate);
    public record WhatsAppDashboard_GetWhatsAppDashboardDeliveryDataDto(int accountId, string fromdate, string todate);
    public record WhatsAppDashboard_GetWhatsAppDashboardDeliveredFailedDataDto(int accountId, string fromdate, string todate);
    public record WhatsAppDashboard_GetWhatsAppPerformanceOverTimeDataDto(int accountId, string fromdate, string todate);
}
