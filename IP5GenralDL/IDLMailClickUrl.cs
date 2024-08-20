using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailClickUrl:IDisposable
    {
        Task<List<MLMailClickUrl>> GetResponseData(MLMailClickUrl mailSendingSettingId, int OffSet, int FetchNext);
        Task<int> MaxCount(MLMailClickUrl mailSendingSettingId);
    }
}