using P5GenralML;

namespace P5GenralDL
{
    public interface IDLCampaignCalendar:IDisposable
    {
        Task<List<MLCampaignCalendar>> GetOverallScheduledDetails(DateTime FromDateTime, DateTime ToDateTime);
    }
}