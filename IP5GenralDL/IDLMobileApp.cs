using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobileApp:IDisposable
    {
        Task<object>  Select_Visits_Duration_Date(MLVisitMobile mlObj);
        Task<object> Select_TimeOnMobile(MLTimeOnMobile mlObj);
        Task<object> Select_Frequency(MLAudienceMobile mlObj);
        Task<object> Select_Recency(MLRecencyMobile mlObj);
        Task<object> Select_TimeSpend(MLTimeSpendMobile mlObj);
        Task<object> Select_MobileCityCount(MLCitiesMobile mlObj);
        Task<object> Select_MobileCityDetails(MLCitiesMobile mlObj);
        Task<object> Select_CityMapDetails(MLCitiesMobile mlObj);
        Task<object> Select_CountryMobileCount(MLCountriesMobile mlObj);
        Task<object> Select_CountryMobile(MLCountriesMobile mlObj);
        Task<object> Select_NetworkDetails(MLNetworkMobile mlObj);
        Task<object> Select_NetworkDetailsCount(MLNetworkMobile mlObj);
        Task<object> Select_ResolutionReportCount(MLNetworkMobile mlObj);
        Task<object> Select_ResolutionDetails(MLNetworkMobile mlObj);
        Task<object> Select_EventTrackingReport(MLEventTrackingMobile mlObj);
        Task<object> Select_GetDeviceCount(MLGetDevicesMobile mlObj);
        Task<object> Select_DeviceDetails(MLGetDevicesMobile mlObj);
        Task<object> Select_OSDetailsCount(MLGetOSMobile mlObj);
        Task<object> EventTrackingCount(MLEventTrackingMobile mlObj);
        Task<object> Select_OSDetails(MLGetOSMobile mlObj);
        Task<object> Select_UniqueVisitsMobileMaxCount(MLUniqueVisitsMobile mlObj);
        Task<object> Select_UniqueVisitsMobile(MLUniqueVisitsMobile mlObj);
        Task<object> Select_GetVisitorsMobile(MLGetVisitorsMobile mlObj); 
        Task<object> Select_SearchByTypeFilterValues(MLGetVisitorsMobile mlObj);
        Task<object> Select_SearchByOnclickMobileCount(MLGetVisitorsMobile mlObj);
        Task<object> Select_SearchByOnclickMobile(MLGetVisitorsMobile mlObj);
        Task<object> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj);
        Task<object> Select_AllPopularPages(_Plumb5MLPopularPages mlObj);
        Task<object> SaveEventTrackSetting(MLEventTrackingMobile mlObj);
        Task<object> UpdateEventTrackSetting(MLEventTrackingMobile mlObj);
        Task<object> DeleteEventTrackSetting(MLEventTrackingMobile mlObj);
        Task<object> BindEventTrackingFilterValues(MLEventTrackingMobile mlObj);
        Task<object> GetScreenList();

    }
}
