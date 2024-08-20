namespace Plumb5.Areas.WebPush.Dto
{
    public record DashboardDto_GetSubcribersDetails(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardDto_GetCampaignDetails(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardDto_GetNotificationDetails(int AccountId, string fromDateTime, string toDateTime);
}
