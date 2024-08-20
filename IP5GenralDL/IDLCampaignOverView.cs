using System.Data;

namespace P5GenralDL
{
    public interface IDLCampaignOverView:IDisposable
    {
        Task<int> CampaignMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName, string TemplateName, string ChannelType);
        Task<DataSet> GetCampaignDetails(string ChannelType);
        Task<DataSet> GetCampaignReportDetails(DateTime fromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName, string TemplateName, string ChannelType);
        Task<DataSet> GetTemplateDetails(string ChannelType);
    }
}