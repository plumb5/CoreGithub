using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Dashboard.Dto
{
    public record DashboardOverview_GetJsonContentDto(int accountId, int UserId);
    public record DashboardOverview_SaveOrUpdateDashboardWidgetsDto(int accountId, int UserId, string jsonString);
    public record DashboardOverview_VisitsReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_GetFrequencyReportDto(int AccountId, string fromdate, string todate, int duration);
    public record DashboardOverview_CountryReportDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record DashboardOverview_CityReportDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record DashboardOverview_GetRecencyDto(int AccountId, int OffSet, int FetchNext);
    public record DashboardOverview_GetTimeSpendDto(int AccountId, string fromdate, string todate, int duration);
    public record DashboardOverview_GetPageDepthDto(int AccountId, string fromdate, string todate, int duration);
    public record DashboardOverview_NewRepeatReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_VisitorsTimeTrendsDto(int accountId, string fromdate, string todate, int duration);
    public record DashboardOverview_AllSourcesReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_TimeOnSiteReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_EmailSmsReportDto(int accountId, int duration, string fromdate, string todate, string key);
    public record DashboardOverview_GetPopularPagesDto(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record DashboardOverview_GetTopEntryExitPagesDto(int accountId, int duration, string fromdate, string todate, string key, int start, int end);
    public record DashboardOverview_GetTotalFormSubmissionsDto(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetAggregateFormsDataDto(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetPlatformDistributionDto(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetCampaignEffectivenessDto(int AdsId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetEngagementDetailsDto(int AdsId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetMailPerformanceOverTimeDto(int AdsId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetDeliveryDetailsDto(int AdsId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetCampaignEffectivenessDataDto(int accountId, string fromdate, string todate);
    public record DashboardOverview_GetSmsDashboardEngagementDataDto(int accountId, string fromdate, string todate);
    public record DashboardOverview_GetSmsDashboardDeliveryDataDto(int accountId, string fromdate, string todate);
    public record DashboardOverview_GetSmsPerformanceOverTimeDataDto(int accountId, string fromdate, string todate);
    public record DashboardOverview_MobileVisitsReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_TimeOnMobileReportDto(int accountId, int duration, string fromdate, string todate);
    public record DashboardOverview_GetMobileFrequencyReportDto(int AccountId, int duration, string fromdate, string todate);
    public record DashboardOverview_GetMobileRecencyDto(int AccountId);
    public record DashboardOverview_GetMobilePushCampaignDetailsDto(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetMobileSubcribersDetailsDto(int AccountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetChatReportDto(int accountId, int ChatId, int Duration, string fromDateTime, string toDateTime);
    public record DashboardOverview_ConversationsDto(int accountId, string fromDateTime, string toDateTime);
    public record DashboardOverview_GetTopSourcesDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record DashboardOverview_GetTopStagesDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record DashboardOverview_GetSummaryDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record DashboardOverview_GetLeadSummaryDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record DashboardOverview_SaveOrUpdateDashboardMailAlertDto(int accountId, DashboardMailAlert mailAlert);
    public record DashboardOverview_GetDashboardMailAlertDto(int accountId, int Id);
    public record DashboardOverview_GetDashboardAllMailAlertDto(int accountId);

}
