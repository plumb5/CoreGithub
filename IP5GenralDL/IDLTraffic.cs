using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLTraffic:IDisposable
    {
        Task<object> GetDropDownReady();
        Task<object> Select_AllSources(_Plumb5MLAllSources mlObj);
        Task<object> Select_Referrer_Search_Social(_Plumb5MLAllSources mlObj);
        Task<object> Select_Referrer_Search_SocialCount(_Plumb5MLAllSources mlObj);
        Task<object> Select_Source_Pages(_Plumb5MLAllSources mlObj);
        Task<object> Select_Search_Keys(_Plumb5MLAllSources mlObj);
        Task<object> GetPaidCampaignCount(_Plumb5MLPaidCampaigns mlObj);
        Task<object> Select_PaidCampaigns(_Plumb5MLPaidCampaigns mlObj);
        Task<object> Select_OverallPercentage(_Plumb5MLAllSources mlObj);
        Task<object> Insert_AttributionSetting(_Plumb5MLAttributionModel mlObj);
        Task<object> AttributionReportCount(_Plumb5MLAttributionModel mlObj);
        Task<object> Select_Attribution(_Plumb5MLAttributionModel mlObj, int start, int end);
        Task<object> Delete_Attribution(_Plumb5MLAttributionModel mlObj);
        Task<object> Select_AttributionModelView(_Plumb5MLAttributionModel mlObj);
        Task<List<MLUserJourney>> Select_VisitorsFlow(_Plumb5MVisitorsFlow mlObj);
        Task<object> Select_UserVisitorsFlow(_Plumb5UserVisitorsFlow mlObj);
        Task<object> Select_AllSources_Compare(_Plumb5MLAllSources mlObj);
        Task<object> Select_EmailSmsSources(_Plumb5MLEmailSmsSources mlObj);

    }
}
