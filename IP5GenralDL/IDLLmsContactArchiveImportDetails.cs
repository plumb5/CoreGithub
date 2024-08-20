using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLLmsContactArchiveImportDetails
    {
        Task<bool> Delete(int LmsContactRemoveOverViewId);
        Task<IEnumerable<DataSet>> GetAllDetails(int LmsContactRemoveOverViewId);
        Task<IEnumerable<DataSet>> GetCountDetails(int LmsContactRemoveOverViewId);
        Task<List<LmsContactArchiveDetails>> GetDetails(int LmsContactRemoveOverViewId, short ArchivedStatus = 0);
        Task<bool> SaveBulkLmsContactImportDetails(DataTable lmsimportdetails);
    }
}