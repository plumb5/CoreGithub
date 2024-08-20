﻿using P5GenralML;

namespace Plumb5.Areas.MobileAnalytics.Dto
{
    public record MobileAppDto_VisitsReport(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_ExportNewReturnVisitsReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_ReferringTrafficExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_TimeOnMobileReport(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_ExportTimeOnMobileReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GetFrequencyReport(int AccountId, int duration, string fromdate, string todate);
    public record MobileAppDto_MobileFrequencyExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GetRecency(int AccountId);
    public record MobileAppDto_MobileRecencyExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GetTimeSpend(int AccountId, int duration, string fromdate, string todate);
    public record MobileAppDto_TimeSpendExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GetCitiesCount(int AccountId, int duration, string fromdate, string todate);
    public record MobileAppDto_GetCities(int AccountId, int duration, string fromdate, string todate, int start, int end);
    public record MobileAppDto_GetCityMapData(int AccountId, string fromdate, string todate, int duration);
    public record MobileAppDto_AppCitiesExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GetMobileCountryReportCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_GetMobileCountryReport(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record MobileAppDto_GetMobileCountryMapData(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_CountryExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_CarrierReport(int accountId, int duration, string fromdate, string todate, int endcount, int startcount);
    public record MobileAppDto_CarrierReportCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_CarrierExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_ResolutionReportCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_ResolutionReport(int accountId, int duration, string fromdate, string todate, int endcount, int startcount);
    public record MobileAppDto_AppResolutionExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_GeofenceReport(int AccountId, string fromdate, string todate, int endcount, int startcount);
    public record MobileAppDto_BindEventTrackingReport(int accountId, string fromdate, string todate, int start = 1, int end = 10);
    public record MobileAppDto_BindDeviceCount(int accountId, string fromdate, string todate);
    public record MobileAppDto_DeviceReport(int accountId, string fromdate, string todate, int start, int end);
    public record MobileAppDto_MobileDevicesExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_OSReportCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_OSReport(int accountId, int duration, string fromdate, string todate, int start = 1, int end = 10);
    public record MobileAppDto_ExportOSReport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_SaveEventTrackSetting(int accountId, string Names, string Events, string EventType, string Action);
    public record MobileAppDto_UpdateEventTrackSetting(int accountId, string Names, string Events, string EventType, string Action, int Id);
    public record MobileAppDto_DeleteEventTrackSetting(int accountId, string Action, int Id);
    public record MobileAppDto_BindEventTrackingFilterValues(int accountId, string fromdate, string todate, string drpSearchBy = "");
    public record MobileAppDto_EventTrackingCount(int accountId, string fromdate, string todate, string drpSearchBy = "", string txtSearchBy = "");
    public record MobileAppDto_BindEventTrackingAllReport(int accountId, string fromdate, string todate, int start, int end, string drpSearchBy = "", string txtSearchBy = "");
    public record MobileAppDto_EventTrackingExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_UniqueVisitsReportMaxCount(int accountId, int duration, string fromdate, string todate, int start, int end, string type, string parameter, string action);
    public record MobileAppDto_UniqueVisitsReport(int accountId, int duration, string fromdate, string todate, int start, int end, string type, string parameter, string action);
    public record MobileAppDto_UniqueVisitsReportExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_BindVisitorsCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_BindVisitors(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record MobileAppDto_MobileVisitorsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_SearchByFilterValues(int accountId, string drpSearchBy, string txtSearchBy, string fromdate, string todate);
    public record MobileAppDto_SearchByOnclickCount(int accountId, string drpSearchBy, string txtSearchBy, string fromdate, string todate);
    public record MobileAppDto_SearchByOnclick(int accountId, string drpSearchBy, string txtSearchBy, string fromdate, string todate, int start, int end);
    public record MobileAppDto_AutoSuggest(int accountId, string type, string q);
    public record MobileAppDto_UniqueVisitsBeacon(int accountId, int duration, string fromdate, string todate, int start, int end, string type, string parameter, string action);
    public record MobileAppDto_UniqueVisitsBeaconExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobileAppDto_SaveBeaconSettings(int accountId, string beaconId, string BeaconName, string UUDI, string Major, string Minor, string BeaconRad, string BeaconTrigger, string beaconAction);
    public record MobileAppDto_EventSettingDelete(int Id);
    public record MobileAppDto_GetEventSettingList(MobileEventSetting mobileEventSetting, int OffSet, int FetchNext);
    public record MobileAppDto_GetPopularPagesCount(int accountId, int duration, string fromdate, string todate);
    public record MobileAppDto_GetPopularPages(int accountId, int duration, string fromdate, string todate, int start, int end);
    public record MobileAppDto_PopularPageExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
