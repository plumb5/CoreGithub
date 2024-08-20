using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLLmsContactArchiveRejectedDetails : IDisposable
    {
        Task<List<LmsContactArchiveRejectedDetails>> GetList(int LmsContactRemoveOverViewId, int OffSet, int FetchNext);
        Task<int> GetMaxCount(int LmsContactRemoveOverViewId);
        Task<bool> SaveBulkLmsContactRejectedDetails(DataTable lmsreportdetails);
    }
}