using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLLmsContactImportRejectedDetails
    {
        Task<List<LmsContactImportRejectedDetails>> GetList(int LmsContactImportOverviewId, int OffSet, int FetchNext);
        Task<int> GetMaxCount(int LmsContactImportOverviewId);
        Task<bool> SaveBulkLmsContactRejectedDetails(DataTable lmsreportdetails);
    }
}