using P5GenralML;

namespace Plumb5.Areas.CustomEvents.Dto
{
    public record CustomEventsOverview_GetMaxCount(int accountId, string fromDateTime, string toDateTime, string CustomEventName);
    public record CustomEventsOverview_GetReportData(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CustomEventName);
    public record CustomEventsOverview_GetEventExtraFieldData(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
    public record CustomEventsOverview_UCPGetEventExtraFieldData(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
    public record CustomEventsOverview_GetEventExtraFieldDataForDragDrop(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
    public record CustomEventsOverview_GetAllEventExtraFieldDataForDragDrop(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid);
    public record CustomEventsOverview_DeleteCustomEventOverViewDetails(int AccountId, int Id);
    public record CustomEventsOverview_ExportCustomOverViewReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record CustomEventsOverview_UserAttrGetReportData(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string CustomEventName);
    public record CustomEventsOverview_UserAttrGetEventExtraFieldData(int accountId, int customEventOverViewId, string fromDateTime, string toDateTime, int contactid, List<string> EventNames = null);
    public record CustomEventsOverview_UpdateDisplayOrder(int AccountId, List<CustomEventExtraField> SettingList);
    public record CustomEventsOverview_GetEventExtraFieldDatasettings(int accountId, int customEventOverViewId);
}
