using P5GenralML;

namespace P5GenralDL
{
    public interface IDLErrorUpdation : IDisposable
    {
        Task<List<MLErrorUpdation>> GetErrorLog(string errorName, DateTime fromDateTime, DateTime toDateTime, int OffSet, int FetchNext);
        Task<int> GetErrorMaxCount(string ErrorName, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLErrorUpdation>> GetLog(MLErrorUpdation mLErrorUpdation, int OffSet, int FetchNext);
        Task<int> SaveLog(MLErrorUpdation mLErrorUpdation);
    }
}