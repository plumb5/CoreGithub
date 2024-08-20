using P5GenralML;

namespace P5GenralDL
{
    public interface IDLDeviceInfo : IDisposable
    {
        Task<DeviceInfo?> GetDeviceInfo(string useragent);
        Task<List<DeviceInfo>> GetDeviceInfoByDeviceId(List<int> ListOfIds);
    }
}