using P5GenralML;

namespace Plumb5.Areas.CustomEvents.Dto
{
    public record ViewCustomEventData_GetEventscountDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, Contact contact, string machineid, Customevents customevents);
    public record ViewCustomEventData_GetEventsReportDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, int customeventoverviewid, int ContactId, Contact contact, string machineid, Customevents customevents);
    public record ViewCustomEventData_MasterFilterEventscountDto(int accountId, string fromDateTime, string toDateTime, int customeventoverviewid, Customevents customevents, int creategroupchk, string Newgroupname, string Newgroupdescription);
    public record ViewCustomEventData_MasterFilterEventsReportDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, int customeventoverviewid, Customevents customevents);
    public record ViewCustomEventData_ExportCustomViewReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ViewCustomEventData_GetEventsDetailsDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, int customeventoverviewid, int ContactId, int id);
    public record ViewCustomEventData_UCPGetEventsReportDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, int customeventoverviewid, int ContactId, Contact contact, string machineid, Customevents customevents);
    public record ViewCustomEventData_UCPGetEventnamesDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CustomEventName, int ContactID, int customeventoverviewid, string machineid);
    public record ViewCustomEventData_GetEventExtraFieldDataDto(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
}
