using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LmsFollowUp_GetUsersDto(int AdsId, int UserId);
    public record LmsFollowUp_GetMaxCountDto(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime, string UserinfoName);
    public record LmsFollowUp_GetReportDto(int AccountId, int UserId, string FromDateTime, string ToDateTime, int OffSet, int FetchNext, string UserinfoName);
    public record LmsFollowUp_ExportLmsFallowUpReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
