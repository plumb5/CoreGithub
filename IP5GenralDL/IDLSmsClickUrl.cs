using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsClickUrl :IDisposable
    {
        Task<List<MLSmsClickUrl>> GetResponseData(MLSmsClickUrl sendingSettingId, int OffSet, int FetchNext);
        Task<int> MaxCount(MLSmsClickUrl sendingSettingId);
    }
}