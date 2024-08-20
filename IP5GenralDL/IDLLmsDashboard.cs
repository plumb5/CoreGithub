using System.Data;

namespace P5GenralDL
{
    public interface IDLLmsDashboard : IDisposable
    {
        Task<DataSet> GetAllSourceWiseLeadsCount(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetAllStageWiseLeadsCount(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetFollowUpLeadsCount(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetFollowUpsData(string UserIdList, List<int> UserGroupIdList, int OrderBy = 0);
        Task<DataSet> GetLeadCampaignDetails(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetRevenueDetails(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetSOURCEWISEVSLABELWISE(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetSTAGEVSSOURCEWISE(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetSTAGEWISEVSLABELWISE(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetSummary(string UserIdList, List<int> UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<DataSet> GetSummaryDetails(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> GetTopPerformerByLeadLabel(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> LableWiseLeadsCount(string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, int OrderBy);
        Task<DataSet> LeadWonLeadLost(int Duration, string UserIdList, string UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime, string StageName, int OrderBy);
        Task<DataSet> TopSources(string UserIdList, List<int> UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<DataSet> TopStages(string UserIdList, List<int> UserGroupIdList, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}