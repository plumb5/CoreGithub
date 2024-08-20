using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppClickUrl:IDisposable
    {
        Task<List<MLWhatsAppClickUrl>> GetResponseData(MLWhatsAppClickUrl sendingSettingId, int OffSet, int FetchNext);
        Task<int> MaxCount(MLWhatsAppClickUrl sendingSettingId);
    }
}