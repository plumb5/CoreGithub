using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebPushCampaignResponseReport:IDisposable
    {
        Task<List<MLWebPushCampaignResponseReport>> GetReportDetails(MLWebPushCampaignResponseReport webpushReport, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<int> MaxCount(MLWebPushCampaignResponseReport webpushReport, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}