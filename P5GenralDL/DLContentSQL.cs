using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Identity.Client;

namespace P5GenralDL
{
    public class _Plumb5DLContentSQL : CommonDataBaseInteraction, IDLContent
    {
        private bool _disposed = false;
        CommonInfo connection;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="AccountId"></param>

        public _Plumb5DLContentSQL()
        {
            connection = GetDBConnection();
        }

        public _Plumb5DLContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public _Plumb5DLContentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DataSet> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj)
        {
            try
            {
                var storeProcCommand = "SelectPopularPage";
                object? param = new { Action = "MaxCount", mlObj.Duration, mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPopularPage";
                object? param = new { Action = "GetList", mlObj.Duration, mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };


                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPopularPage";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                storeProcCommand = "SelectTopEntryExitPage";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Duration };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                storeProcCommand = "SelectTopEntryExitPage";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End, mlObj.Duration };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageFilters";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Key, mlObj.devicetype, mlObj.LeadSource, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "GetPageViewUniqueVisitor", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "LeadSource", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "TimeSpent", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "TimeTrends", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "Frequency", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "TotalVisits", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "OverallPercentage", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectSearchKeysForPage";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "City", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "Source", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Key, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { Action = "Source", mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.devicetype };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectallPage";
                object? param = new { mlObj.Query };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
            string storeProcCommand = "SelectTrackedEvents";
            object? param = new { Action = "MaxCountEventValue", mlObj.FromDate, mlObj.ToDate, mlObj.Events };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> EventValueReport(_Plumb5MLEventTracking mlObj)
        {
            try
            {
                var storeProcCommand = "SelectTrackedEvents";
                object? param = new { Action = "GetEventValueList", mlObj.Names, mlObj.Events, mlObj.EventType, mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectTrackedEvents";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.drpSearchBy, mlObj.SearchTextValue };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectTrackedEvents";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.drpSearchBy, mlObj.SearchTextValue };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectTrackedEvents";
                object? param = new { Action = "BindFilterValue", mlObj.FromDate, mlObj.ToDate, mlObj.drpSearchBy };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "InsertEventSetting";
                object? param = new { mlObj.Events, mlObj.Names, mlObj.EventType };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "InsertEventSetting";
                object? param = new { mlObj.Events, mlObj.Names, mlObj.EventType, mlObj.Id };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "InsertEventSetting";
                object? param = new { Action = "UpdateStatus", mlObj.Id, mlObj.Status };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "InsertEventSetting";
                object? param = new { Action = mlObj.Action, mlObj.Id };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectExistingEvent";

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, commandType: CommandType.StoredProcedure); ;
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
                var storeProcCommand = "SelectRecommendation";
                object? param = new { mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, commandType: CommandType.StoredProcedure); ;
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
                var storeProcCommand = "SelectHeatMaps";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.ListData };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, commandType: CommandType.StoredProcedure); ;
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
                var storeProcCommand = "SelectHeatMapPages";
                object? param = new { mlObj.FromDate, mlObj.ToDate };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, commandType: CommandType.StoredProcedure); ;
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

                var storeProcCommand = "SelectPageAnalysis";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.PageName, mlObj.Key, mlObj.devicetype, mlObj.LeadSource };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, commandType: CommandType.StoredProcedure); ;
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
