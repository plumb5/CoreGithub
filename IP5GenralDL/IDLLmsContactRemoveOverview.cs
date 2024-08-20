using P5GenralML;

namespace P5GenralDL
{
    public interface IDLLmsContactRemoveOverview : IDisposable
    {
        Task<LmsContactRemoveOverview?> Get(LmsContactRemoveOverview contactImportOverview);
        Task<List<LmsContactRemoveOverview>> GetAllDetails(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string UserIdList);
        Task<int> GetAllDetailsMaxCount(DateTime FromDateTime, DateTime ToDateTime, string UserIdList);
        Task<List<LmsContactRemoveOverview>> GetDetailsToImport();
        Task<List<LmsContactRemoveOverview>> GetList(LmsContactRemoveOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<int> Save(LmsContactRemoveOverview contactRemoveOverview);
        Task<bool> Update(LmsContactRemoveOverview contactImportOverview);
    }
}