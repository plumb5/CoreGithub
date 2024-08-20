using P5GenralML;

namespace Plumb5.Areas.CustomEvents.Dto
{
    public record ViewAggregateEventData_GetMaxCountDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields, string DisplayFieldsforexport);
    public record ViewAggregateEventData_GetAggregateDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields);
    public record ViewAggregateEventData_GetEventExtraFieldDataDto(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
    public record ViewAggregateEventData_GetEventExtraFieldsDataDto(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid);
    public record ViewAggregateEventData_GetMaxAggregateDetailsDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents eventFileds, List<string> DisplayCustomExtraFields, List<CustomEventExtraField> eventextrafiledsName);
    public record ViewAggregateEventData_GetUniqueContactDetailsDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents eventFileds);
    public record ViewAggregateEventData_GetUniquevisitorDetailsDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents eventFileds);
    public record ViewAggregateEventData_ExportAggregateCustomViewReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
