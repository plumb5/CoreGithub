using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLDashboard:IDisposable
    {
        Task<object> GetJsonContent(int UserId);
        Task<Int32> SaveOrUpdateDashboardWidgets(int AdsId, int UserId, string jsonString);
        Task<object> GetDashboarJsonContent(int DashboardId);
        Task<DataSet> Select_Visits_Duration_Date(_Plumb5MLVisits mlObj);
        Task<DataSet> Select_Visits_Duration_Date_Compare(_Plumb5MLVisits mlObj);
        Task<DataSet> Select_Country(_Plumb5MLCountry mlObj);
        Task<object> Select_CountryMapData(_Plumb5MLCountry mlObj);
        Task<object> Select_CountryMaxCount(_Plumb5MLCountry mlObj);
        Task<DataSet> Select_NewVsRepeat(_Plumb5MLNewRepeat mlObj);
        Task<DataSet> Select_TimeOnSite(_Plumb5MLTimeOnSite mlObj);
        Task<DataSet> Select_Visitors_TimeTrends(_Plumb5MLTimeTrends mlObj);
        Task<object> Select_OverallData(_Plumb5MLVisits mlObj);
        Task<object> Select_OverallPercentage(_Plumb5MLVisits mlObj);
    }
}
