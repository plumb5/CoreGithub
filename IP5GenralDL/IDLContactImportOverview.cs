using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactImportOverview:IDisposable
    {
        Task<ContactImportOverview?> Get(ContactImportOverview contactImportOverview);
        Task<List<ContactImportOverview>> GetAllDetails(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string UserIdList);
        Task<int> GetAllDetailsMaxCount(DateTime FromDateTime, DateTime ToDateTime, string UserIdList);
        Task<ContactImportOverview?> GetDetailsToImport();
        Task<List<ContactImportOverview>> GetList(ContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<ContactImportOverview?> GetRunningDetails();
        Task<int> Save(ContactImportOverview contactImportOverview);
        Task<bool> Update(ContactImportOverview contactImportOverview);
    }
}