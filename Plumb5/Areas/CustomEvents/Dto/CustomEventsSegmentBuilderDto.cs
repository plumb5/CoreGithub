using Plumb5.Areas.SegmentBuilder.Models;

namespace Plumb5.Areas.CustomEvents.Dto
{
    public record CustomEventsSegmentBuilder_GetCustomEventsNames(int AccountId);
    public record CustomEventsSegmentBuilder_VerifyQuery(int AccountId, List<SegmentCondition> Segment, string[] TableNames, string FromDate = null, string ToDate = null);
    public record CustomEventsSegmentBuilder_CreateSegmentBuilder(int AccountId, int GroupId, string GroupName, string GroupDescription, List<SegmentCondition> Segment, string[] TableNames, string FromDate = null, string ToDate = null);
}
