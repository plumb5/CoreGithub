namespace Plumb5.Areas.Sms.Dto
{
    public record SmsDashboard_GetCampaignEffectivenessDataDto(int accountId, string fromdate, string todate);
    public record SmsDashboard_GetSmsDashboardEngagementDataDto(int accountId, string fromdate, string todate);
    public record SmsDashboard_GetSmsDashboardDeliveryDataDto(int accountId, string fromdate, string todate);
    public record SmsDashboard_GetSmsPerformanceOverTimeDataDto(int accountId, string fromdate, string todate);
    public record SmsDashboard_GetSmsDashboardBouncedRejectedDataDto(int accountId, string fromdate, string todate); 
}
