using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LeadSource_SaveUpdateLmsGroupDto(int AccountId, int UserId, int LmsGroupId, string Name);
    public record LeadSource_GetMaxCountDto(int accountId, LmsGroup lmsgroup);
    public record LeadSource_GetAllDetailsDto(int accountId, LmsGroup lmsgroup, int OffSet, int FetchNext);
    public record LeadSource_DeleteDto(int accountId, int lmsGroupId);
    public record LeadSource_LmsGroupExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record LeadSource_SaveOrUpdateDto(LmsSourceType lmssourcetype, int AccountId);
    public record LeadSource_GetLmsSorceTypeDto(int accountId);
}
