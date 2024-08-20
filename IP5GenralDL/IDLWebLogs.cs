using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebLogs
    {
        Task<List<WebLogs>> GetLogsForNotification(int AdsId);
        Task<int> GetMaxCount(WebLogs logDetails, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<WebLogs>> GetReportData(WebLogs logDetails, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
        Task<int> SaveLog(WebLogs logs);
        Task<bool> UpdateLog(WebLogs logs);
    }
}