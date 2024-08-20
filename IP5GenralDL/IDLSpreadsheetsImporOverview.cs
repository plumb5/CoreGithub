using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSpreadsheetsImporOverview:IDisposable
    {
        Task<List<SpreadsheetsImporOverview>> GetDetails(int SpreadsheetsImportId, int OffSet, int FetchNext);
        Task<int> MaxCount(int SpreadsheetsImportId);
        Task<int> SaveResponse(int SpreadsheetsImportId, string ServerResponses, string ErrorMessage = null);
    }
}