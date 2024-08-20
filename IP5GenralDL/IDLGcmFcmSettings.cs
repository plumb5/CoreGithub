using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGcmFcmSettings
    {
        Task<object> GetNotification(MLGcmFcmSettings mlObj);
        Task<object> GettingIOSSettings(APNsettings mlObj);
    }
}