namespace Plumb5.Areas.WebPush.Dto
{
    public record ManageBrowserNotificationsDto_GetScheduledMaxCount(int AdsId, string fromdate, string todate, string Name = null);
    public record ManageBrowserNotificationsDto_GetScheduledData(int AdsId, string fromdate, string todate, int OffSet, int FetchNext, string Name = null);
    public record ManageBrowserNotificationsDto_ExportScheduleCampaign(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ManageBrowserNotificationsDto_DeleteScheduled(int accountId, int Id);
    public record ManageBrowserNotificationsDto_GetRssMaxCount(int AdsId, string fromdate, string todate, string CampaignName = null);
    public record ManageBrowserNotificationsDto_GetRssData(int AdsId, string fromdate, string todate, int OffSet, int FetchNext, string CampaignName = null);
    public record ManageBrowserNotificationsDto_ChangeRssStatus(int accountId, int Id, bool Status);
    public record ManageBrowserNotificationsDto_DeleteRss(int accountId, int Id);
    public record ManageBrowserNotificationsDto_ExportRssCampaign(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ManageBrowserNotificationsDto_ExportCampaignIdentifier(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
