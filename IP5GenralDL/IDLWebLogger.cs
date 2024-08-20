using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebLogger:IDisposable
    {
        Task<List<WebLogger>> GetLogData(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string UserIdList);
        Task<WebLogger?> GetLogDetails(WebLogger logDetails);
        Task<List<WebLogger>> GetLogsForNotification(WebLogger logDetails, string UserIdList);
        Task<int> GetMaxCount(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, string UserIdList);
        Task<long> SaveLog(WebLogger logDetails);
    }
}