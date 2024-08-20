using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebPushDashboard : IDisposable
    {
        Task<MLWebPushDashboard?> GetCampaignDetails(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLWebPushDashboard>> GetNotificationDetails(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLWebPushDashboard?> GetSubcribersDetails(DateTime FromDateTime, DateTime ToDateTime);
    }
}