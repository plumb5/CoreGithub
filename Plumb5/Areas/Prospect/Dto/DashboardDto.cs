using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record Dashboard_GetUsersDto(int AdsId);
    public record Dashboard_GetSummaryDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetFollowUpsDataDto(int AdsId, int UserId = 0);
    public record Dashboard_LeadWonLostReportDto(int AdsId, int Duration, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetTopSourcesDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record Dashboard_GetTopStagesDto(int AdsId, string FromDateTime, string ToDateTime, int UserId = 0);
    public record Dashboard_GetLabelWiseLeadsCountDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetAllStageWiseLeadsCountDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<MLUserHierarchy> userHierarchy);
    public record Dashboard_GetAllSourceWiseLeadsCountDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<MLUserHierarchy> userHierarchy);
    public record Dashboard_GetFollowUpLeadsCountDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetLeadLabelByUserPerformanceDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<MLUserHierarchy> userHierarchy);
    public record Dashboard_GetCampaignDetailsDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetStageWiseVsLabelDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<LmsStage> AllStageList);
    public record Dashboard_GetSourceWiseVsLabelDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<MLLmsGroup> lmsgrplist);
    public record Dashboard_GetStageWiseVsSourceWiseDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist, List<LmsStage> AllStageList);
    public record Dashboard_GetRevenueDetailsDto(int AdsId, string FromDateTime, string ToDateTime, int OrderBy, string UserIds, List<int> userGroupslist);
    public record Dashboard_GetUserHierarchyDto(int AdsId, int UserId = 0);
}
