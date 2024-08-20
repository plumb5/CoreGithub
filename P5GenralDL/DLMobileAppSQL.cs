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
    public class DLMobileAppSQL : CommonDataBaseInteraction, IDLMobileApp
    {
        CommonInfo connection;
        private bool _disposed = false;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="AccountId"></param>
        public DLMobileAppSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLMobileAppSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        /// <summary>
        /// Visits
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Visits_Duration_Date(MLVisitMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitMobile";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate };
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
        /// Time On Site
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_TimeOnMobile(MLTimeOnMobile mlObj)
        {
            try
            {
                var storeProcCommand = "selectvisitmobile";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate };
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
        /// Frequency
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Frequency(MLAudienceMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectFrequencyMobile";

                object? param = new { mlObj.FromDate, mlObj.ToDate }; 
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
        public async Task<object> Select_Recency(MLRecencyMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectRecencyMobile";
                object? param = new { };
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
        public async Task<object> Select_TimeSpend(MLTimeSpendMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectTimeSpendMobile";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate };
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
        /// /
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_MobileCityCount(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectMobileCity_New";
                object? param = new { Action= "MaxCount", mlObj.Duration, mlObj.FromDate, mlObj.ToDate };
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
        /// /
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_MobileCityDetails(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectMobileCity_New";
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

        public async Task<object> Select_CityMapDetails(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectMobileCity_New";
                object? param = new { Action = "GetMapData", mlObj.FromDate, mlObj.ToDate, mlObj.Duration };
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
        /// Network
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_CountryMobileCount(MLCountriesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectMobileCountry";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_CountryMobile(MLCountriesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectMobileCountry";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };
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

        public async Task<object> Select_NetworkDetails(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectNetworkMobile";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };
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
        public async Task<object> Select_NetworkDetailsCount(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectNetworkMobile";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_ResolutionReportCount(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectScreenResolution";
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
        public async Task<object> Select_ResolutionDetails(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectScreenResolution";
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


        public async Task<object> Select_EventTrackingReport(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectTrackedEventsMobile";

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
        public async Task<object> Select_GetDeviceCount(MLGetDevicesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectDeviceDetailsMobile";

                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount };

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
        /// Devices
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_DeviceDetails(MLGetDevicesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectDeviceDetailsMobile";
                 
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount };
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
        /// Os
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OSDetailsCount(MLGetOSMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectOSMobile";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> EventTrackingCount(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectTrackedEventsMobile";
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
        /// Os
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OSDetails(MLGetOSMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectOSMobile";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount };
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
        public async Task<object> Select_UniqueVisitsMobileMaxCount(MLUniqueVisitsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectUniqueVisitsMobile";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Data };
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
        public async Task<object> Select_UniqueVisitsMobile(MLUniqueVisitsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectUniqueVisitsMobile";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key, mlObj.Data };
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

        public async Task<object> Select_GetVisitorsMobile(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitorMobileReport)";
                object? param = new {Action= "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };
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

        public async Task<object> Select_SearchByTypeFilterValues(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitorMobile";
                object? param = new { Action = "GetFilterValue", mlObj.FromDate, mlObj.ToDate, mlObj.Type, mlObj.SearchBy };
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

        public async Task<object> Select_SearchByOnclickMobileCount(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitorMobile";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.Type, mlObj.SearchBy };
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
        public async Task<object> Select_SearchByOnclickMobile(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitorMobile";

                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Type, mlObj.SearchBy };
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>

        public async Task<object> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAppPopularPage";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_AllPopularPages(_Plumb5MLPopularPages mlObj)
        {

            try
            {
                var storeProcCommand = "SelectAppPopularPage";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };
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

        public async Task<object> SaveEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "MobileEvent_Setting";

                object? param = new { mlObj.Action, mlObj.Events, mlObj.Names, mlObj.EventType };
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
        public async Task<object> UpdateEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "MobileEvent_Setting";
                object? param = new { mlObj.Action, mlObj.Events, mlObj.Names, mlObj.EventType, mlObj.Id };
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
        public async Task<object> DeleteEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "MobileEvent_Setting";
                object? param = new { mlObj.Action, mlObj.Id };
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
        public async Task<object> BindEventTrackingFilterValues(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "SelectTrackedEventsMobile";
                object? param = new { Action= "BindFilterValue", mlObj.drpSearchBy };
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

        public async Task<object> GetScreenList()
        {
            var storeProcCommand = "Mobile_Screen";
            object? param = new { Action = "GetList" };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
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

