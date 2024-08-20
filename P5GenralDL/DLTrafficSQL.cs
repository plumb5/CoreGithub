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
    public class _Plumb5DLTrafficSQL : CommonDataBaseInteraction, IDLTraffic
    {
        CommonInfo connection;
        private bool _disposed = false;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="adsId"></param>
        public _Plumb5DLTrafficSQL(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public _Plumb5DLTrafficSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<object> GetDropDownReady()
        {
            try
            {
                var storeProcCommand = "Paid_Campaign";
                object? param = new { Action = "GetDropDownValue" };
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
        /// All Sources
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_AllSources(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAllSource";
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Referrer_Search_Social(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAllSource";
                object? param = new { Action = "GetList", mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End };
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Referrer_Search_SocialCount(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectspecifiedsource_maxcount( @FromDate, @ToDate, @Key)";
                object? param = new { Action = "MaxCount", mlObj.FromDate, mlObj.ToDate, mlObj.Key };
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
        /// Referrer - Source_Pages
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Source_Pages(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectSourcePages)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End, mlObj.Type };
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Search_Keys(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectSearchBy";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End, mlObj.Page };
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
        public async Task<object> GetPaidCampaignCount(_Plumb5MLPaidCampaigns mlObj)
        {
            try
            {
                var storeProcCommand = "Paid_Campaign";
                object? param = new { mlObj.Key, mlObj.FromDate, mlObj.ToDate, mlObj.UTMParameter };
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
        /// Paid Campaigns
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_PaidCampaigns(_Plumb5MLPaidCampaigns mlObj)
        {
            try
            {
                var storeProcCommand = "Paid_Campaign";
                object? param = new { mlObj.Key, mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.UTMParameter };
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
        public async Task<object> Select_OverallPercentage(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectOverallPercentage";
                object? param = new { mlObj.FromDate, mlObj.ToDate, Action = "Sources" };
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
        public async Task<object> Insert_AttributionSetting(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "InsertAttributionModelSetting";
                object? param = new { mlObj.ModelName, mlObj.PageName };
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

        public async Task<object> AttributionReportCount(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAttributionModel";
                object? param = new { Action = "GetAttrModelMaxCount", mlObj.FromDate, mlObj.ToDate };
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
        public async Task<object> Select_Attribution(_Plumb5MLAttributionModel mlObj, int start, int end)
        {
            try
            {
                var storeProcCommand = "SelectAttributionModel)";
                object? param = new { Action = "GetAttrModelReport", mlObj.FromDate, mlObj.ToDate, start, end };
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
        public async Task<object> Delete_Attribution(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "InsertAttributionModelSetting";
                object? param = new { mlObj.Key, mlObj.AttributionId };
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
        public async Task<object> Select_AttributionModelView(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAttributionModelView";

                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.AttributionId, mlObj.Key };
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
        public async Task<List<MLUserJourney>> Select_VisitorsFlow(_Plumb5MVisitorsFlow mlObj)
        {
            try
            {
                var storeProcCommand = mlObj.Duration == 1 ? "VisitorsFlow_Day" : "VisitorFlow_Cached";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Interaction, mlObj.Action, mlObj.ListData, mlObj.ListDataNew };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<MLUserJourney>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();



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
        public async Task<object> Select_UserVisitorsFlow(_Plumb5UserVisitorsFlow mlObj)
        {
            try
            {
                var storeProcCommand = "SelectUserVisitorsFlow";
                object? param = new { mlObj.Interaction, mlObj.Action, mlObj.Domain, mlObj.MachineId, mlObj.ListData };
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
        /// All Sources Compare
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_AllSources_Compare(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectAllSourceCompare";
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
        /// //Select_EmailSmsSources
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        /// 
        public async Task<object> Select_EmailSmsSources(_Plumb5MLEmailSmsSources mlObj)
        {
            try
            {
                var storeProcCommand = "SelectEmailSmsVisits";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate, mlObj.Key };
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
