namespace Plumb5.Areas.MobileInApp.Dto
{
    public record Reports_GetFields(int InAppCampaignId, int AccountId);
    public record Reports_GetMobileInAppFormCampaign(int accountId);
    public record Reports_GetFormResponsesMaxCount(int accountId, string fromDateTime, string toDateTime, int InAppCampaignId = 0);
    public record Reports_GetFormResponsesReport(int accountId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, int InAppCampaignId = 0);
    public record Reports_UpdateIsNew(int AdsId, int Id, bool isNew);
    public record Reports_FormResponsesExport(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Reports_GetInAppResponsesMaxCount(int accountId, string fromDateTime, string toDateTime, string InAppCampaignName = null);
    public record Reports_GetInAppResponsesReport(int accountId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, string InAppCampaignName = null);
}
