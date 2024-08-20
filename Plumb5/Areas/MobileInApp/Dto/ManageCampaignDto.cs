using P5GenralML;

namespace Plumb5.Areas.MobileInApp.Dto
{
    public record ManageCampaign_GetMaxCount(int AccountId, string fromdate, string todate, string Name = null);
    public record ManageCampaign_GetReportData(int AccountId, string fromdate, string todate, int OffSet, int FetchNext, string Name = null);
    public record ManageCampaign_DeleteCampaign(int AccountId, Int16 Id);
    public record ManageCampaign_ChangePriority(int AccountId, List<MobileInAppCampaign> campaigndetails);
    public record ManageCampaign_ToogleStatus(int AccountId, MobileInAppCampaign inappCampaign);
    public record ManageCampaign_ExportInappManageCampaign(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
