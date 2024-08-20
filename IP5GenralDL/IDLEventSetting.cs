using P5GenralML;

namespace P5GenralDL
{
    public interface IDLEventSetting : IDisposable
    {
        Task<List<EventSetting>> GET(string EventName);
        Task<List<EventSetting>> GetEventTrackingDetails();
    }
}