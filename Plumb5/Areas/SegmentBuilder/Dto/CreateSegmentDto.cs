using P5GenralML;
using Plumb5.Areas.SegmentBuilder.Models;

namespace Plumb5.Areas.SegmentBuilder.Dto
{
    public record CreateSegment_CreateSegmentBuilderDto(int AccountId, int GroupId, string GroupName, string GroupDescription, List<SegmentCondition> Segment, string[] TableNames, bool IsNewOrExisting, int Days = 1, string FromDate = null, string ToDate = null, bool IsIntervalOrOnce = false, bool IsRecurring = false);
    public record CreateSegment_SaveOrUpdateGroupDto(int accountId, Groups group);
    public record CreateSegment_GetSegmentDto(int AccountId, int GroupId);
    public record CreateSegment_GetGroupMaxCountDto(int accountId);
    public record CreateSegment_VerifyQueryDto(int AccountId, List<SegmentCondition> Segment, string[] TableNames, int Days = 1, string FromDate = null, string ToDate = null);
    public record CreateSegment_GetAllTableColumnsDto(int AccountId);
    public record CreateSegment_GetAllFieldDetailsDto(int AccountId);
    public record CreateSegment_GetGroupsDetailsDto(int AccountId, int GroupId);
}
