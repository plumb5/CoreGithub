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
    public class DLDashboardPG : CommonDataBaseInteraction, IDLDashboard
    {
        CommonInfo connection;

        public DLDashboardPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLDashboardPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<object>  GetJsonContent(int UserId)
        {
            var storeProcCommand = "select * from dashboard_details_get(@UserId)"; 
            object? param = new { UserId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> SaveOrUpdateDashboardWidgets(int AdsId, int UserId, string jsonString)
        {
            string storeProcCommand = "select dashboard_details_save(@AdsId, @UserId, @jsonString)";
            object? param = new { AdsId, UserId, jsonString };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<object> GetDashboarJsonContent(int DashboardId)
        {
            var storeProcCommand = "select * from dashboard_details_getbyid(@DashboardId)"; 
            object? param = new  { DashboardId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        /// <summary>
        /// Visits
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Visits_Duration_Date(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisit(@Duration,@FromDate,@ToDate)"; 
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
        /// Visits compare
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Visits_Duration_Date_Compare(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "select * from SelectVisitCompare(@Duration,@FromDate,@ToDate)"; 
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
        public async Task<DataSet> Select_Country(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectcountry_getlist(@Duration,@FromDate,@ToDate,@Start,@End)"; 
                object? param = new { mlObj.Duration,mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End };
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
        public async Task<object> Select_CountryMapData(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectcountry_getmapdata(@FromDate,@ToDate,@Duration)";  
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
        public async Task<object> Select_CountryMaxCount(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectcountry_maxcount(@Duration,@FromDate,@ToDate)";
                 
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate  };
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
        /// New vs Repeat
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_NewVsRepeat(_Plumb5MLNewRepeat mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisit(@Duration,@FromDate,@ToDate)"; 
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
        public async Task<DataSet> Select_TimeOnSite(_Plumb5MLTimeOnSite mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisit(@Duration,@FromDate,@ToDate)"; 
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
        /// Time Trends
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Visitors_TimeTrends(_Plumb5MLTimeTrends mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectvisitortimetrends(@Duration,@FromDate,@ToDate)"; 
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
        /// Percentage Comparison
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OverallData(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectoverallcount(@FromDate,@ToDate)"; 
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
        public async Task<object> Select_OverallPercentage(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectoverallpercentage_sources( @FromDate,@ToDate)";
                object? param = new {  mlObj.FromDate, mlObj.ToDate };
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

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
