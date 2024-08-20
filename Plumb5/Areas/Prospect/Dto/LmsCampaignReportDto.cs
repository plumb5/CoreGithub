using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LmsCampaignReport_GetUsersDto(int AdsId, int UserId);
    public record LmsCampaignReport_GetMaxCountDto(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, string UserinfoName, int OrderbyVal);

    public record LmsCampaignReport_GetReportDto(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, int OffSet, int FetchNext, string UserinfoName, int OrderbyVal);

    public record LmsCampaignReport_ExportLmsCampaignReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record LmsCampaignReport_LmsPhoneCallResponseDetailsDto(int AccountId, int UserInfoUserId, string FromDateTime, string ToDateTime, int OrderbyVal, string CalledNumber, LmsCustomReport filterLead, string CallEvents);
}
