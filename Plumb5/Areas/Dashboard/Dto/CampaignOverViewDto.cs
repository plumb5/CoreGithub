namespace Plumb5.Areas.Dashboard.Dto
{
    public record CampaignOverView_GetMaxCountDto(int accountId, string fromDateTime, string toDateTime, string CampaignName, string TemplateName, string ChannelType);
    public record CampaignOverView_GetReportDetailsDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CampaignName, string TemplateName, string ChannelType);
    public record CampaignOverView_GetTemplateListDto(int accountId, string ChannelType);
    public record CampaignOverView_GetCampaignListDto(int accountId, string ChannelType);
    public record CampaignOverView_ExportCampaignOveriViewReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    
}
