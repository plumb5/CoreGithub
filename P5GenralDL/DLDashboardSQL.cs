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
    public class DLDashboardSQL : CommonDataBaseInteraction, IDLDashboard
    {
        CommonInfo connection;

        public DLDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<object> GetJsonContent(int UserId)
        {
            var storeProcCommand = "Dashboard_Details";
            object? param = new { Action= "Get", UserId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> SaveOrUpdateDashboardWidgets(int AdsId, int UserId, string jsonString)
        {
            string storeProcCommand = "Dashboard_Details";
            object? param = new { Action = "Save", AdsId, UserId, jsonString };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<object> GetDashboarJsonContent(int DashboardId)
        {
            var storeProcCommand = "Dashboard_Details";
            object? param = new { Action = "GetById", DashboardId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                var storeProcCommand = "SelectVisit";
                object? param = new {mlObj.Duration, mlObj.FromDate, mlObj.ToDate };
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
        /// Visits compare
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Visits_Duration_Date_Compare(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitCompare"; 
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
        public async Task<DataSet> Select_Country(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "SelectCountry";
                object? param = new { Action= "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Duration };
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
        public async Task<object> Select_CountryMapData(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "SelectCountry";
                object? param = new { Action = "SelectCountry", mlObj.FromDate, mlObj.ToDate, mlObj.Duration };
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
        public async Task<object> Select_CountryMaxCount(_Plumb5MLCountry mlObj)
        {
            try
            {
                var storeProcCommand = "SelectCountry";
                var paramName = new List<string> { "@_fromdate", "@_todate", "@_duration" };
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.Duration };
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
        /// New vs Repeat
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_NewVsRepeat(_Plumb5MLNewRepeat mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisit";
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
        public async Task<DataSet> Select_TimeOnSite(_Plumb5MLTimeOnSite mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisit";
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
        /// Time Trends
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<DataSet> Select_Visitors_TimeTrends(_Plumb5MLTimeTrends mlObj)
        {
            try
            {
                var storeProcCommand = "SelectVisitorTimeTrends"; 
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
        /// Percentage Comparison
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_OverallData(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "SelectOverallCount";
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
        public async Task<object> Select_OverallPercentage(_Plumb5MLVisits mlObj)
        {
            try
            {
                var storeProcCommand = "SelectOverallPercentage";
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

