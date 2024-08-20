using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileInAppDashBoard : IDisposable
    {
        Task<MLMobileInAppDashBoard?> AggregateInAppData(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLMobileInAppDashBoard?> GetPlatformDistribution(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLMobileInAppDashBoard>> TopFivePerFormingInApp(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLMobileInAppDashBoard>> TotalInAppFormSubmissions(DateTime FromDateTime, DateTime ToDateTime);
    }
}