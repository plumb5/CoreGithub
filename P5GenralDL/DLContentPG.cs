using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class _Plumb5DLContentPG : CommonDataBaseInteraction, IDLContent
    {
        private bool _disposed = false;
        CommonInfo connection;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="AccountId"></param>

        public _Plumb5DLContentPG()
        {
            connection = GetDBConnection();
        }

        public _Plumb5DLContentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public _Plumb5DLContentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        
        public async Task<DataSet> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpopularpage_maxcount(@Duration,@FromDate,@ToDate)";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;

            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_AllPopularPages(_Plumb5MLPopularPages mlObj)
        {

            try
            {
                var storeProcCommand = "select * from selectpopularpage_getlist(@Duration, @FromDate, @ToDate, @Start, @End)";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };


                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// Top One Popular Page
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_TopOnePopularPages(_Plumb5MLPageAnalysisPopularPage mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpopularpage(@FromDate, @ToDate, @Start, @End)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_EntryandExitPageCount(_Plumb5MLEntryandExit mlObj)
        {
            string storeProcCommand = string.Empty;
            string Action = string.Empty;

            try
            {
                storeProcCommand = "select * from selecttopentryexitpage_maxcount( @Duration,@FromDate, @ToDate, @Key )";
                object? param = new { mlObj.Duration,mlObj.FromDate, mlObj.ToDate, mlObj.Key  };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_EntryandExitPage(_Plumb5MLEntryandExit mlObj)
        {
            string storeProcCommand = string.Empty;
            string Action = string.Empty;

            try
            {
                storeProcCommand = "select * from selecttopentryexitpage_getlist( @Duration,@FromDate, @ToDate, @Start, @End, @Key)";
                object? param = new { mlObj.Duration,mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_PageFilters(_Plumb5MLEntryandExit mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpagefilters(@FromDate, @ToDate, @Start, @End, @Key)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_PageAnalysisCommon(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };
                if (mlObj.Key.ToLower() == "totalvisits")
                    storeProcCommand = "select * from selectpageanalysis_totalvisits(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "getpageviewuniquevisitor")
                    storeProcCommand = "select * from selectpageanalysis_getpageviewuniquevisitor(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "overallpercentage")
                    storeProcCommand = "select * from selectpageanalysis_overallpercentage(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "source")
                    storeProcCommand = "select * from selectpageanalysis_source(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "city")
                    storeProcCommand = "select * from selectpageanalysis_city(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "searchby")
                    storeProcCommand = "select * from selectpageanalysis_searchby(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "timespent")
                    storeProcCommand = "select * from selectpageanalysis_timespent(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "timetrends")
                    storeProcCommand = "select * from selectpageanalysis_timetrends(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "leadsource")
                    storeProcCommand = "select * from selectpageanalysis_leadsource(@FromDate, @ToDate, @devicetype, @PageName)";

                else if (mlObj.Key.ToLower() == "frequency")
                    storeProcCommand = "select * from selectpageanalysis_frequency(@FromDate, @ToDate, @devicetype, @PageName)";


                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageViewUniqueVisitor(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_getpageviewuniquevisitor(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName  };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisLeadSource(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_leadsource(@FromDate, @ToDate, @PageName, @devicetype)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisTimeSpent(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_timespent(@FromDate, @ToDate,@devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisTimeTrends(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_timetrends(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisFrequency(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_frequency(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName};

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisTotalVisit(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_totalvisits(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetPageAnalysisOverallPercentage(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_overallpercentage(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        /// 
        public async Task<DataSet> Select_SearchKeysForPage(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectsearchkeysforpage(@FromDate, @ToDate, @PageName, @Start, @End)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> Select_PageAnalysisCity(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_city(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> Select_PageAnalysisSource(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_source(@FromDate, @ToDate, @devicetype, @PageName)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype, mlObj.PageName };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_PageAnalysisCommonCitySource(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis(@FromDate, @ToDate, @PageName, @Key, @devicetype)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Key, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> SelectPageAnalysisSource(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectpageanalysis_source(@FromDate, @ToDate,  @devicetype,@PageName )";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.devicetype ,mlObj.PageName  };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Pages(_Plumb5MLAutoSuggest mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectallpage(@Query)";
                object? param = new { mlObj.Query };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<int> GetEventValueMaxCount(_Plumb5MLEventTracking mlObj)
        {
            string storeProcCommand = "select selecttrackedevents_maxcounteventvalue(@FromDate, @ToDate, @Events)";
            object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Events };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> EventValueReport(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedevents_geteventvaluelist(@Names, @Events, @EventType, @FromDate, @ToDate, @Start, @End)";
                object? param = new { mlObj.Names, mlObj.Events, mlObj.EventType, mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        public async Task<DataSet> GetEventTrackingReportCount(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedevents_maxcount(@FromDate, @ToDate, @drpSearchBy, @SearchTextValue)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.drpSearchBy, mlObj.SearchTextValue };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// Event Tracking Report
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_EventTrackingReport(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedevents_getlist(@FromDate, @ToDate, @Start, @End, @drpSearchBy, @SearchTextValue)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.drpSearchBy, mlObj.SearchTextValue };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> BindEventTrackingFilterValues(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedevents_bindfilter(@FromDate, @ToDate, @drpSearchBy)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.drpSearchBy };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> SaveEventTrackSetting(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from inserteventsetting_insert(@Events, @Names, @EventType)";
                object? param = new { mlObj.Events, mlObj.Names, mlObj.EventType };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> UpdateEventTrackSetting(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from inserteventsetting_update(@Events, @Names, @EventType, @Id)";
                object? param = new { mlObj.Events, mlObj.Names, mlObj.EventType, mlObj.Id };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> UpdateStatus(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from inserteventsetting_updatestatus(@Id, @Status)";
                object? param = new { mlObj.Id, mlObj.Status };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> DeleteEventTrackSetting(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from inserteventsetting_delete(@Id)";
                object? param = new { mlObj.Id };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        /// <
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_ExistingEventTrackSetting(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectexistingevent()";

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlobj"></param>
        /// <returns></returns>
        public async Task<DataSet> RecommendationReport(MLRecommendation mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectrecommendation(@FromDate,@ToDate)";
                object? param = new { mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }

        /// <summary>
        /// Heat Map
        /// </summary>
        /// <returns></returns>
        public async Task<DataSet> Select_HeatMap(MLHeatMap mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectheatmaps(@FromDate, @ToDate, @ListData)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.ListData };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> Select_TopOnePages(MLHeatMap mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectheatmappages(@FromDate,@ToDate)";
                object? param = new { mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        public async Task<DataSet> GetLeadSourceMaxInnerCount(_Plumb5MLPageAnalysis mlObj)
        {
            try
            {

                var storeProcCommand = "select * from selectpageanalysis(@FromDate, @ToDate, @PageName, @Key, @devicetype, @LeadSource)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Key, mlObj.devicetype, mlObj.LeadSource };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                return null;
            }
        }
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {

                }
            }
        }
        public void Dispose()
        {
            Dispose(true);
        }
    }
}
