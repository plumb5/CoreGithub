using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContent : IDisposable
    {
        Task<DataSet> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj);
        Task<DataSet> Select_AllPopularPages(_Plumb5MLPopularPages mlObj);
        Task<DataSet> Select_TopOnePopularPages(_Plumb5MLPageAnalysisPopularPage mlObj);
        Task<DataSet> Select_EntryandExitPageCount(_Plumb5MLEntryandExit mlObj);
        Task<DataSet> Select_EntryandExitPage(_Plumb5MLEntryandExit mlObj);
        Task<DataSet> Select_PageFilters(_Plumb5MLEntryandExit mlObj);
        Task<DataSet> Select_PageAnalysisCommon(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageViewUniqueVisitor(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisLeadSource(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisTimeSpent(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisTimeTrends(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisFrequency(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisTotalVisit(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> GetPageAnalysisOverallPercentage(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> Select_SearchKeysForPage(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> Select_PageAnalysisCity(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> Select_PageAnalysisSource(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> Select_PageAnalysisCommonCitySource(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> SelectPageAnalysisSource(_Plumb5MLPageAnalysis mlObj);
        Task<DataSet> Select_Pages(_Plumb5MLAutoSuggest mlObj);
        Task<int> GetEventValueMaxCount(_Plumb5MLEventTracking mlObj);
        Task<DataSet> EventValueReport(_Plumb5MLEventTracking mlObj);
        Task<DataSet> GetEventTrackingReportCount(_Plumb5MLEventTracking mlObj);
        Task<DataSet> Select_EventTrackingReport(_Plumb5MLEventTracking mlObj);
        Task<DataSet> BindEventTrackingFilterValues(_Plumb5MLEventTracking mlObj);
        Task<DataSet> SaveEventTrackSetting(_Plumb5MLEventTracking mlObj);
        Task<DataSet> UpdateEventTrackSetting(_Plumb5MLEventTracking mlObj);
        Task<DataSet> UpdateStatus(_Plumb5MLEventTracking mlObj);
        Task<DataSet> DeleteEventTrackSetting(_Plumb5MLEventTracking mlObj);
        Task<DataSet> Select_ExistingEventTrackSetting(_Plumb5MLEventTracking mlObj);
        Task<DataSet> RecommendationReport(MLRecommendation mlObj);
        Task<DataSet> Select_HeatMap(MLHeatMap mlObj);
        Task<DataSet> Select_TopOnePages(MLHeatMap mlObj);
        Task<DataSet> GetLeadSourceMaxInnerCount(_Plumb5MLPageAnalysis mlObj);
    }
}
