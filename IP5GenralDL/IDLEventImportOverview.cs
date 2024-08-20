using P5GenralML;

namespace P5GenralDL
{
    public interface IDLEventImportOverview
    {
        Task<EventImportOverview?> GetDetailsToImport();
        Task<EventImportOverview?> GetRunningDetails();
        Task<int> Save(EventImportOverview eventImportOverview);
        Task<bool> Update(EventImportOverview eventImportOverview);
    }
}