using P5GenralML;

namespace P5GenralDL
{
    public interface IDLCacheReportDetails : IDisposable
    {
        Task<object> GetCachedMobileReportDetails(MLCacheReportDetails cachereport);
        Task<object> GetCacheReportDetails(MLCacheReportDetails cachereport);
    }
}