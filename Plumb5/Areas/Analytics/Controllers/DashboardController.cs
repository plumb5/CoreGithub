using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Controllers;
using System.Data;
using System.Web; 
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.OutputCaching;
using NPOI.SS.Formula.Functions;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        private DomainInfo _accountInfo;
        public string CurrentUTCDateTimeForOutputCache = "";
        public IActionResult Visits()
        {
            return View();
        }
        public IActionResult Countries()
        {
            return View();
        }

        public IActionResult NewReturn()
        {
            return View();
        }
        public IActionResult TimeOnSite()
        {
            return View();
        }
        public IActionResult TimeTrends()
        {
            return View();
        }
        [HttpPost]
        /// <summary>
        /// Visits Report
        /// </summary>
        /// <param name="adsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> VisitsReport([FromBody] Dashboard_VisitsReportDto Dashboarddto)
        {
            try
            {
                #region OutputCache Current TodateTime
                if (Dashboarddto.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                
                object VisitorSessionData = null;
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    VisitorSessionData = await objDL.Select_Visits_Duration_Date(new _Plumb5MLVisits
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate
                    });
                } 
                var getdata = JsonConvert.SerializeObject(new { VisitorSessionData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }

        [HttpPost]
        public async Task<JsonResult> WebSessionExport([FromBody] Dashboard_WebSessionExportDto Dashboarddto)
        {
            DataSet dataSet = null;
            using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.AccountId, SQLProvider))
            {
                dataSet = await objDL.Select_Visits_Duration_Date(new _Plumb5MLVisits
                {
                    AccountId = Dashboarddto.AccountId,
                    Duration = Dashboarddto.Duration,
                    FromDate = Dashboarddto.FromDateTime,
                    ToDate = Dashboarddto.TodateTime
                });
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(Dashboarddto.AccountId, SQLProvider); 
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Day = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["TrackerDate"])).Value.Date,
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisit"]),
                                             PageViews = Convert.ToString(dataRow["TotalVisit"]),
                                             NewVisitors = Convert.ToString(dataRow["NewVisitors"]),
                                             AvgTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsWebSession_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Dashboarddto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (Dashboarddto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath } );
        }
        /// <summary>
        /// Visits Report Compare
        /// </summary>
        /// <param name="adsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> VisitsReportCompare([FromBody] Dashboard_VisitsReportCompareDto Dashboarddto)
        {
            try
            {
                DataSet ds=new DataSet();
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                     ds = await objDL.Select_Visits_Duration_Date_Compare(new _Plumb5MLVisits
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate
                    });
                }
                
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> CountryReport([FromBody] Dashboard_CountryReportDto Dashboarddto)
        {
            try
            {
                object CountryData = null;

                #region OutputCache Current TodateTime
                if (Dashboarddto.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    CountryData = await objDL.Select_Country(new _Plumb5MLCountry
                    {
                        AccountId = Dashboarddto.accountId,
                        Start = Dashboarddto.start,
                        End = Dashboarddto.end,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate,
                        Duration = Dashboarddto.duration
                    });
                }
                 
                var getdata = JsonConvert.SerializeObject(new { CountryData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> CountryMapData([FromBody] Dashboard_CountryMapDataDto Dashboarddto)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    ds = await objDL.Select_CountryMapData(new _Plumb5MLCountry
                    {
                        AccountId = Dashboarddto.accountId,
                        Start = 0,
                        End = 0,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate,
                        Duration = Dashboarddto.duration
                    });
                } 
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> CountryReportMaxCount([FromBody] Dashboard_CountryReportMaxCountDto Dashboarddto)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    ds = await objDL.Select_CountryMaxCount(new _Plumb5MLCountry
                    {
                        AccountId = Dashboarddto.accountId,
                        Start = 0,
                        End = 0,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate,
                        Duration = Dashboarddto.duration
                    });
                }
                
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<JsonResult>  WebCountryExport([FromBody] Dashboard_WebCountryExportDto Dashboarddto)
        {
            DataSet dataSet = new DataSet();
            using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.AccountId, SQLProvider))
            {
                dataSet = await objDL.Select_Country(new _Plumb5MLCountry
                {
                    AccountId = Dashboarddto.AccountId,
                    Start = Dashboarddto.OffSet,
                    End = Dashboarddto.FetchNext,
                    FromDate = Dashboarddto.FromDateTime,
                    ToDate = Dashboarddto.TodateTime,
                    Duration = Dashboarddto.Duration
                });
            } 
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Countries = Convert.ToString(dataRow["Country"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisits"]),
                                             PageViews = Convert.ToString(dataRow["TotalVisits"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsWebCountry_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Dashboarddto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (Dashboarddto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// New vs Repeat Report
        /// </summary>
        /// <param name="adsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
         [OutputCache(Duration = 300)]
        public async Task<ActionResult> NewVsReturnReport([FromBody] Dashboard_NewVsReturnReportDto Dashboarddto)
        {
            try
            {
                #region OutputCache Current TodateTime
                if (Dashboarddto.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                object NewVsReturnData = null; 
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    NewVsReturnData = await objDL.Select_NewVsRepeat(new _Plumb5MLNewRepeat
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate
                    });
                }

                
                var getdata = JsonConvert.SerializeObject(new { NewVsReturnData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> WebNewReturnExport([FromBody] Dashboard_WebNewReturnExportDto Dashboarddto)
        {
            DataSet dataSet = new DataSet();
            using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.AccountId, SQLProvider))
            {
                dataSet = await objDL.Select_NewVsRepeat(new _Plumb5MLNewRepeat
                {
                    AccountId = Dashboarddto.AccountId,
                    Duration = Dashboarddto.Duration,
                    FromDate = Dashboarddto.FromDateTime,
                    ToDate = Dashboarddto.TodateTime
                });
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(Dashboarddto.AccountId, SQLProvider); 

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Day = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["TrackerDate"])).Value.Date,
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisit"]),
                                             NewVisitors = Convert.ToString(dataRow["NewVisitors"]),
                                             SingleVisitors = Convert.ToString(dataRow["SingleVisitors"]),
                                             RepeatVisitors = Convert.ToString(dataRow["RepeatVisitors"]),
                                             ReturningVisitors = Convert.ToString(dataRow["ReturningVisitors"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsWebNewReturn_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Dashboarddto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (Dashboarddto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath } );
        }
        /// <summary>
        /// Time on site Report
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> TimeOnSiteReport([FromBody] Dashboard_TimeOnSiteReportDto Dashboarddto)
        {
            
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(Dashboarddto.accountId, SQLProvider)).ToString();
            try
            {
                #region OutputCache Current TodateTime
                if (Dashboarddto.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    object timedata = await objDL.Select_TimeOnSite(new _Plumb5MLTimeOnSite
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate
                    });
                    var getdata = JsonConvert.SerializeObject(new { timedata, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
                 
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<JsonResult> TimeOnSiteReportExport([FromBody] Dashboard_TimeOnSiteReportExportDto Dashboarddto)
        {
            DataSet dataTable = null;
            using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.AccountId, SQLProvider))
            {
                dataTable = await objDL.Select_TimeOnSite(new _Plumb5MLTimeOnSite
                {
                    AccountId = Dashboarddto.AccountId,
                    Duration = Dashboarddto.Duration,
                    FromDate = Dashboarddto.FromDateTime,
                    ToDate = Dashboarddto.TodateTime
                });
            } 

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(Dashboarddto.AccountId, SQLProvider); 
            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataTable.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             Day = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["TrackerDate"])).Value.ToString("MMMM") + " " + Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["TrackerDate"])).Value.Day,
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"])),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisit"]),
                                             PageViews = Convert.ToString(dataRow["TotalVisit"]),
                                             NewVisitors = Convert.ToString(dataRow["NewVisitors"])
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsTimeOnSite_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Dashboarddto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (Dashboarddto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
         [OutputCache(Duration = 300)]
        public async Task<ActionResult> VisitorsTimeTrends([FromBody] Dashboard_VisitorsTimeTrendsDto Dashboarddto)
        {
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(Dashboarddto.accountId, SQLProvider)).ToString();
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    object TimeTrendsData = await objDL.Select_Visitors_TimeTrends(new _Plumb5MLTimeTrends
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate,
                    });
                    var getdata = JsonConvert.SerializeObject(new { TimeTrendsData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
                  
            }
            catch
            {
                return null;
            }

        }
        [HttpPost]
        public async Task<JsonResult> VisitorsTimeTrendsExport([FromBody] Dashboard_VisitorsTimeTrendsExportDto Dashboarddto)
        {

            DataSet dataTable = null;
            using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.AccountId, SQLProvider))
            {
                dataTable = await objDL.Select_Visitors_TimeTrends(new _Plumb5MLTimeTrends
                {
                    AccountId = Dashboarddto.AccountId,
                    Duration = Dashboarddto.Duration,
                    FromDate = Dashboarddto.FromDateTime,
                    ToDate = Dashboarddto.TodateTime
                });
            }
             

            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataTable.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             Time = Convert.ToString(dataRow["DateShort"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"])),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisit"]),
                                             PageViews = Convert.ToString(dataRow["TotalVisit"]),
                                             NewVisitors = Convert.ToString(dataRow["NewVisitors"]),

                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsTimeTrends_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Dashboarddto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (Dashboarddto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath } );
        }
        [HttpPost]
        /// <summary>
        /// Percentage Comparison
        /// </summary>
        /// <param name="adsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <returns></returns>
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> OverallData([FromBody] Dashboard_OverallDataDto dashboarddto)
        {
            try
            {
                var ds = new object();
                if (dashboarddto.duration == 1 || dashboarddto.duration == 5)
                {
                    using (var objDL = DLDashboard.GetDLDashboard(dashboarddto.accountId, SQLProvider))
                    {
                        ds = await objDL.Select_OverallData(new _Plumb5MLVisits
                        {
                            AccountId = dashboarddto.accountId,
                            Duration = dashboarddto.duration,
                            FromDate = dashboarddto.fromdate,
                            ToDate = dashboarddto.todate
                        });
                    }

                     
                }
                else
                {
                    using (var objDL = DLCacheReportDetails.GetDLCacheReportDetails(dashboarddto.accountId, SQLProvider))
                    {
                        ds = await objDL.GetCacheReportDetails(new MLCacheReportDetails
                        {
                            Action = "OverAllData",
                            AccountId = dashboarddto.accountId,
                            Duration = dashboarddto.duration,
                            FromDate = dashboarddto.fromdate,
                            ToDate = dashboarddto.todate
                        });
                    }
                     
                }
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

            
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <returns></returns>
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> OverallPercentage([FromBody] Dashboard_OverallPercentageDto Dashboarddto)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLDashboard.GetDLDashboard(Dashboarddto.accountId, SQLProvider))
                {
                    ds = await objDL.Select_OverallPercentage(new _Plumb5MLVisits
                    {
                        AccountId = Dashboarddto.accountId,
                        Duration = Dashboarddto.duration,
                        FromDate = Dashboarddto.fromdate,
                        ToDate = Dashboarddto.todate
                    });
                }
                 
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }
    }
}
