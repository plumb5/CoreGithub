using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLAudience : IDisposable
    {
        Task<object> BindFilterValues(_Plumb5MLGetVisitors mlObj);
        Task<object> GetVisitorReportCount(_Plumb5MLGetVisitors mlObj);
        Task<object> Insert_AddToGroup(_Plumb5MLGroupName mlObj);
        Task<object> Select_BrowserDetailsWithDateRange(_Plumb5MLBrowsersDetails mlObj);
        Task<object> Select_BrowserReportCount(_Plumb5MLBrowsersDetails mlObj);
        Task<object> Select_DeviceDetails(_Plumb5MLGetDevices mlObj);
        Task<object> Select_DeviceDetailsCount(_Plumb5MLGetDevices mlObj);
        Task<object> Select_Frequency(_Plumb5MLFrequency mlObj);
        Task<DataSet> Select_GetVisitors(_Plumb5MLGetVisitors mlObj);
        Task<object> Select_GroupNames();
        Task<object> Select_CityDetails(_Plumb5MLCity mlObj);
        Task<object> Select_CityDetails_MaxCount(_Plumb5MLCity mlObj);
        Task<object> Select_CityMapDetails(_Plumb5MLCity mlObj);
        Task<object> Select_NetworkDetails(_Plumb5MLGetNetwork mlObj);
        Task<object> Select_NetworkDetailsCount(_Plumb5MLGetNetwork mlObj);
        Task<object> Select_PageDepth(_Plumb5MLPageDepth mlObj);
        Task<object> Select_Recency(_Plumb5MLRecency mlObj);
        Task<object> Select_RecencyReturn(_Plumb5MLRecencyReturn mlObj);
        Task<object> Select_SearchByOnclick(_Plumb5MLSearchBy mlObj);
        Task<DataSet> Select_SearchBy_AutoSuggest(_Plumb5MLAutosuggest mlObj);
        Task<object> Select_TimeSpend(_Plumb5MLTimeSpend mlObj);
        Task<object> Transaction(_Plumb5MLUpdateScore mlObj);
        Task<object> Update_Score(_Plumb5MLUpdateScore mlObj);
        Task<object> Select_Location_CityDetails(_Plumb5MLCity mlObj);
        Task<object> Select_Location_CityMapDetails(_Plumb5MLCity mlObj);
        Task<object> Select_Location_CityDetails_MaxCount(_Plumb5MLCity mlObj);
    }
}