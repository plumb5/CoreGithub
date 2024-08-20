using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLLmsContactImportDetails
    {
        Task<bool> Delete(int LmsContactImportOverViewId);
        Task<DataSet> GetAllDetails(int LmsContactImportOverViewId);
        Task<DataSet> GetCountDetails(int LmsContactImportOverViewId);
        Task<List<LmsContactImportDetails>> GetDetails(int LmsContactImportOverViewId);
        Task<bool> SaveBulkLmsContactImportDetails(DataTable lmsimportdetails);
    }
}