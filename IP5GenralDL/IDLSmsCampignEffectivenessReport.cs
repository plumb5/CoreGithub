using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsCampignEffectivenessReport:IDisposable
    {
        Task<List<MLSmsCampaignEffectivenessReport>> GetReportDetails(MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport, int OffSet, int FetchNext);
        Task<int> MaxCount(MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport);
    }
}