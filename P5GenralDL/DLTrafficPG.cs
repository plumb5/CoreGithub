using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class _Plumb5DLTrafficPG : CommonDataBaseInteraction, IDLTraffic
    {
        CommonInfo connection;
        private bool _disposed = false;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="adsId"></param>
        public _Plumb5DLTrafficPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public _Plumb5DLTrafficPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<object> GetDropDownReady()
        {
            try
            {
                var storeProcCommand = "select * from paid_campaign_getdropdownvalue()";
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
        /// All Sources
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_AllSources(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectallsource(@Duration, @FromDate, @ToDate )";
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Referrer_Search_Social(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectspecifiedsource_getlist( @FromDate, @ToDate, @Key, @Start, @End)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End };
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Referrer_Search_SocialCount(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectspecifiedsource_maxcount( @FromDate, @ToDate, @Key)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key };
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
        /// Referrer - Source_Pages
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Source_Pages(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectsourcepages( @FromDate, @ToDate, @Key, @Start, @End, @Type )";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End, mlObj.Type };
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
        /// Referrer - Organic Search
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_Search_Keys(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectsearchby(@FromDate, @ToDate, @Key, @Start, @End, @Page)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.Start, mlObj.End, mlObj.Page };
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
        public async Task<object> GetPaidCampaignCount(_Plumb5MLPaidCampaigns mlObj)
        {
            try
            {
                var storeProcCommand = "select * from paid_campaign_maxcount(@FromDate, @ToDate, @Key, @UTMParameter)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Key, mlObj.UTMParameter };
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
        /// Paid Campaigns
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_PaidCampaigns(_Plumb5MLPaidCampaigns mlObj)
        {
            try
            {
                var storeProcCommand = "select * from paid_campaign_getdetails(@FromDate, @ToDate, @Start, @End, @Key, @UTMParameter )";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Start, mlObj.End, mlObj.Key, mlObj.UTMParameter };
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
        public async Task<object> Select_OverallPercentage(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectoverallpercentage_sources(@FromDate,@ToDate)";
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
        public async Task<object> Insert_AttributionSetting(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "select * from insertattributionmodelsetting(@ModelName,@PageName)";
                object? param = new { mlObj.ModelName, mlObj.PageName };
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

        public async Task<object> AttributionReportCount(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectattributionmodel_getattrmodelmaxcount(@FromDate, @ToDate)";
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
        public async Task<object> Select_Attribution(_Plumb5MLAttributionModel mlObj, int start, int end)
        {
            try
            {
                var storeProcCommand = "select * from selectattributionmodel_getattrmodelreport(@FromDate,@ToDate,@start,@end)";
                object? param = new { mlObj.FromDate, mlObj.ToDate, start, end };
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
        public async Task<object> Delete_Attribution(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "select * from insertattributionmodelsetting_delete(@AttributionId)";
                object? param = new { mlObj.AttributionId };
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
        public async Task<object> Select_AttributionModelView(_Plumb5MLAttributionModel mlObj)
        {
            try
            {
                var storeProcCommand = "";

                if (mlObj.Key == "FirstInteraction")
                    storeProcCommand = "select * from selectattributionmodelview_firstinteraction(@FromDate,@ToDate,@AttributionId)";
                else if (mlObj.Key == "LastInteraction")
                    storeProcCommand = "select * from selectattributionmodelview_lastinteraction(@FromDate,@ToDate,@AttributionId)";
                else if (mlObj.Key == "Linear")
                    storeProcCommand = "select * from selectattributionmodelview_linear(@FromDate,@ToDate,@AttributionId)";
                else if (mlObj.Key == "Position")
                    storeProcCommand = "select * from selectattributionmodelview_position(@FromDate,@ToDate,@AttributionId)";

                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.AttributionId };
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
        public async Task<List<MLUserJourney>> Select_VisitorsFlow(_Plumb5MVisitorsFlow mlObj)
        {
            try
            {
                string jsonListData = JsonConvert.SerializeObject(mlObj.ListData, Formatting.Indented);
                string jsonListDataNew = JsonConvert.SerializeObject(mlObj.ListDataNew, Formatting.Indented);
                var storeProcCommand = mlObj.Duration == 1 ? "select * from visitorsflow_day(@FromDate, @ToDate, @Interaction, @Action, @ListData, @ListDataNew )" : "select * from visitorflow_cached(@FromDate, @ToDate, @Interaction, @Action, @ListData, @ListDataNew )";
                object? param = new { mlObj.FromDate, mlObj.ToDate, mlObj.Interaction, mlObj.Action, ListData = new JsonParameter(jsonListData), ListDataNew = new JsonParameter(jsonListDataNew) };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<MLUserJourney>(storeProcCommand, param)).ToList();

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
                var storeProcCommand = "select * from SelectUserVisitorsFlow( @Interaction, @Action, @Domain, @MachineId, @ListData )";
                object? param = new { mlObj.Interaction, mlObj.Action, mlObj.Domain, mlObj.MachineId, mlObj.ListData };
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
        /// All Sources Compare
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        public async Task<object> Select_AllSources_Compare(_Plumb5MLAllSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from SelectAllSourceCompare( @Duration, @FromDate, @ToDate)";
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
        /// //Select_EmailSmsSources
        /// </summary>
        /// <param name="mlObj"></param>
        /// <returns></returns>
        /// 
        public async Task<object> Select_EmailSmsSources(_Plumb5MLEmailSmsSources mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectemailsmsvisits(  @Duration, @FromDate, @ToDate, @Key)";
                object? param = new { mlObj.Duration, mlObj.FromDate, mlObj.ToDate, mlObj.Key };
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
