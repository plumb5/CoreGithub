using P5GenralML;

namespace P5GenralDL
{
    public interface IDLLmsContactImportOverview
    {
        Task<LmsContactImportOverview?> Get(LmsContactImportOverview contactImportOverview);
        Task<List<LmsContactImportOverview>> GetAllDetails(int OffSet, int FetchNext);
        Task<int> GetAllDetailsMaxCount();
        Task<List<LmsContactImportOverview>> GetDetailsToImport();
        Task<List<LmsContactImportOverview>> GetList(LmsContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<int> Save(LmsContactImportOverview contactImportOverview);
        Task<bool> Update(LmsContactImportOverview contactImportOverview);
    }
}