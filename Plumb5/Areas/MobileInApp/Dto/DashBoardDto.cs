namespace Plumb5.Areas.MobileInApp.Dto
{
    public record DashBoard_GetPlatformDistribution(int AccountId, string fromDateTime, string toDateTime);
    public record DashBoard_GetTotalInAppFormSubmissions(int AccountId, string fromDateTime, string toDateTime);
    public record DashBoard_GetTopFivePerFormingInApp(int AccountId, string fromDateTime, string toDateTime);
    public record DashBoard_GetAggregateInAppData(int AccountId, string fromDateTime, string toDateTime);
}
