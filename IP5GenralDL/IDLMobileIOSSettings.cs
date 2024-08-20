using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileIOSSettings
    {
        Task<List<MobileGcmSettings>> GetGcmProjectNoPackageName();
        Task<MobileGcmSettings?> GetGcmSettings();
        Task<List<MobileInAppDisplaySettings>> GetInAppDisplaySettings(InAppRequest InAppRequest);
        Task<string> GetIpInformation(int AccountId, double IpDecimal);
        Task<MobileIOSSettings?> GetMobileIOSSettings();
        Task<FormResponseReportToSetting?> GetresponseSettings(int MobileFormId);
        Task<List<MobileIOSSettings>> GetSettings();
        Task<bool> RegisterUser(MobileUserInfo userData);
        Task<bool> Save(MobileDeviceInfo rData);
        Task<bool> SaveEndSession(MobileEndRequest eData);
        Task<bool> SaveFormResponses(MobileFormRequest formData);
        Task<bool> SaveInitSession(MobileTrackData rData);
        Task<bool> SaveLogData(MobileEventData eventData);
    }
}