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
    public class DLMobileAppPG : CommonDataBaseInteraction, IDLMobileApp
    {
        CommonInfo connection;
        private bool _disposed = false;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="AccountId"></param>
        public DLMobileAppPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLMobileAppPG(string connectionString)
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
                var storeProcCommand = "select * from selectvisitmobile(@Duration,@FromDate,@ToDate)"; 
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
        /// Time On Site
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_TimeOnMobile(MLTimeOnMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitmobile(@Duration,@FromDate,@ToDate)"; 
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
        /// Frequency
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Frequency(MLAudienceMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from  selectfrequencymobile(@Duration,@FromDate,@ToDate)";
                 
                object? param = new { mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_Recency(MLRecencyMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from   selectrecencymobile()"; 
                object? param = new { }; 
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
        public async Task<object> Select_TimeSpend(MLTimeSpendMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttimespendmobile(@Duration,@FromDate,@ToDate)"; 
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
        /// /
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_MobileCityCount(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectmobilecity_new_maxcount(@Duration,@FromDate,@ToDate)"; 
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
        /// /
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_MobileCityDetails(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectmobilecity_new_getlist(@Duration,@FromDate,@ToDate,@Start,@End)"; 
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

        public async Task<object> Select_CityMapDetails(MLCitiesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select  * from selectmobilecity_new_getmapdata(@FromDate,@ToDate,@Duration)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Duration };
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
        /// Network
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_CountryMobileCount(MLCountriesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectmobilecountry_maxcount(@FromDate,@ToDate)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_CountryMobile(MLCountriesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectmobilecountry_getlist( @FromDate, @ToDate, @Start, @End )"; 
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
           
        public async Task<object> Select_NetworkDetails(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectnetworkmobile_getlist(@FromDate, @ToDate, @Start, @End )"; 
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
        public async Task<object> Select_NetworkDetailsCount(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectnetworkmobile_maxcount(@FromDate,@ToDate)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_ResolutionReportCount(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectscreenresolution_maxcount(@Duration,@FromDate,@ToDate)"; 
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
        public async Task<object> Select_ResolutionDetails(MLNetworkMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectscreenresolution_getlist(@Duration, @FromDate, @ToDate, @Start, @End )"; 
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
           
         
        public async Task<object> Select_EventTrackingReport(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedeventsmobile_getlist(@FromDate, @ToDate, @Start, @End, @drpSearchBy, @SearchTextValue )";
                 
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
        public async Task<object> Select_GetDeviceCount(MLGetDevicesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectdevicedetailsmobile_maxcount(@FromDate, @ToDate, @startcount, @endcount)";
                 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount };
                 
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
        /// Devices
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_DeviceDetails(MLGetDevicesMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectdevicedetailsmobile_getlist(@FromDate, @ToDate, @startcount, @endcount)";

                
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount }; 
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
        /// Os
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OSDetailsCount(MLGetOSMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectosmobile_maxcount(@FromDate,@ToDate)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> EventTrackingCount(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedeventsmobile_maxcount( @FromDate, @ToDate, @drpSearchBy, @SearchTextValue)"; 
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
        /// Os
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OSDetails(MLGetOSMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectosmobile_getlist(@FromDate, @ToDate, @startcount, @endcount)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.startcount, mlObj.endcount };
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
        public async Task<object> Select_UniqueVisitsMobileMaxCount(MLUniqueVisitsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectuniquevisitsmobile_maxcount( @FromDate, @ToDate, @Key, @Data)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Data };
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
        public async Task<object> Select_UniqueVisitsMobile(MLUniqueVisitsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectuniquevisitsmobile( @FromDate, @ToDate, @Start, @End, @Key, @Data )"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key, mlObj.Data };
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
        
        public async Task<object> Select_GetVisitorsMobile(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitormobilereport_getlist(@FromDate, @ToDate, @Start, @End )"; 
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

        public async Task<object> Select_SearchByTypeFilterValues(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitormobile_getfiltervalue( @FromDate, @ToDate, @Type, @SearchBy)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Type, mlObj.SearchBy };
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

        public async Task<object> Select_SearchByOnclickMobileCount(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitormobile_maxcount( @FromDate, @ToDate, @Type, @SearchBy)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Type, mlObj.SearchBy };
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
        public async Task<object> Select_SearchByOnclickMobile(MLGetVisitorsMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitormobile_getlist(@FromDate, @ToDate, @Start, @End, @Type, @SearchBy)";
             
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Type, mlObj.SearchBy };
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
         
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
         
        public async Task<object> Select_AllPopularPagesCount(_Plumb5MLPopularPages mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectapppopularpage_maxcount(@FromDate,@ToDate)"; 
                object? param = new { mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_AllPopularPages(_Plumb5MLPopularPages mlObj)
        {

            try
            {
                var storeProcCommand = "select * from selectapppopularpage_getlist( @FromDate, @ToDate, @Start, @End )"; 
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

        public async Task<object> SaveEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from mobileevent_setting_save( @FromDate, @ToDate, @Start, @End )";
              
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
        public async Task<object> UpdateEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from mobileevent_setting_update( @Events, @Names, @EventType, @Id)"; 
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
        public async Task<object> DeleteEventTrackSetting(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from mobileevent_setting_delete(@Id)";
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
        public async Task<object> BindEventTrackingFilterValues(MLEventTrackingMobile mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selecttrackedeventsmobile_bindfiltervalue(@drpSearchBy)"; 
                object? param = new { mlObj.drpSearchBy };
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

        public async Task<object> GetScreenList()
        {
            var storeProcCommand = "select * from mobile_screen_getlist()"; 
            object? param = new { };
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
