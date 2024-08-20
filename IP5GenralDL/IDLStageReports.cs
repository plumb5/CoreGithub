using System.Data;

namespace P5GenralDL
{
    public interface IDLStageReports:IDisposable
    {
        Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, List<int> UseridList, bool IsCreatedDate);
        Task<DataSet> GetReport(DateTime FromDate, DateTime ToDate, int Offset, int FetchNext, List<int> UseridList, bool IsCreatedDate);
    }
}