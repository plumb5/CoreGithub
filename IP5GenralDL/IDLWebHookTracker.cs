using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebHookTracker : IDisposable
    {
        Task<List<WebHookTracker>> GetList(WebHookTracker webHookTracker, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
        Task<int> GetMaxCount(WebHookTracker webHookTracker, DateTime FromDateTime, DateTime ToDateTime);
        Task<bool> Save(WebHookTracker webHookTracker);
    }
}