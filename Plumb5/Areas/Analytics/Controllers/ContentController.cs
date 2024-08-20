using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Data;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using System.Text.RegularExpressions;
using NPOI.SS.Formula.Functions;
using Microsoft.AspNetCore.OutputCaching;
using System.Net;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class ContentController : BaseController
    {
        public ContentController(IConfiguration _configuration) : base(_configuration)
        { }

        private DomainInfo DomainNameinfo;
        public string CurrentUTCDateTimeForOutputCache = "";

        public IActionResult PopularPages()
        {
            return View();
        }
        public IActionResult AllPopularPages()
        {
            return View();
        }
        public IActionResult PageAnalysis()
        {
            DomainNameinfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string DomainName = DomainNameinfo.DomainName;
            ViewBag.DomainName = DomainName;
            return View();
        }
        public IActionResult SearchKeysForPage()
        {
            return View();
        }
        public IActionResult TopEntryPages()
        {
            return View();
        }
        public IActionResult AllTopEntryPages()
        {
            return View();
        }
        public IActionResult TopExitPages()
        {
            return View();
        }
        public IActionResult AllTopExitPages()
        {
            return View();
        }
        public IActionResult EventTracking()
        {
            return View();
        }
        public IActionResult AllEventTracking()
        {
            return View();
        }
        public IActionResult EventTrackingSetting()
        {
            return View();
        }
        public IActionResult AllPageAnalysis()
        {
            DomainNameinfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string DomainName = DomainNameinfo.DomainName;
            ViewBag.DomainName = DomainName;
            return View();
        }
        public IActionResult HeatMaps()
        {
            return View();
        }
        public IActionResult HeatMaps1()
        {
            return View();
        }
        public IActionResult HeatMapsIframe()
        {
            return View();
        }
        public IActionResult Recommendation()
        {
            return View();
        }
        public IActionResult PageFilter()
        {
            return View();
        }

        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> GetPopularPages([FromBody] Content_GetPopularPagesDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                #region OutputCache Current TodateTime
                if (details.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;
                object PopularPageData = null;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_AllPopularPages(new _Plumb5MLPopularPages()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = details.start,
                        End = details.end,
                        Duration = details.duration
                    });
                }

                PopularPageData = new CommonFunction().Decode((DataSet)ds);
                var getdata = JsonConvert.SerializeObject(new { PopularPageData, CurrentUTCDateTimeForOutputCache }, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> PopularPageExport([FromBody] Content_PopularPageExportDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.AccountId, SQLProvider).Result;
                DataSet PopularPageData = null;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    PopularPageData = await objDL.Select_AllPopularPages(new _Plumb5MLPopularPages()
                    {
                        AccountId = details.AccountId,
                        Duration = details.Duration,
                        FromDate = details.FromDateTime,
                        ToDate = details.TodateTime,
                        Start = details.OffSet,
                        End = details.FetchNext
                    });
                }

                int RowNo = 1;
                var objDataTable = (from dataRow in PopularPageData.Tables[0].Select()
                                    select new
                                    {
                                        SLNo = RowNo++,
                                        PageName = dataRow["PageName"].ToString(),
                                        AverageTimeOnPage = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"])),
                                        PageViews = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                        UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                        City = dataRow["City"].ToString()
                                    }).CopyToDataTableExport();

                DataSet resultDataSet = new DataSet();
                resultDataSet.Tables.Add(objDataTable);


                string FileName = "AnalyticsPopularPage_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
                //string MainPath = "E:/" + FileName;

                if (details.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(resultDataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(resultDataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> BindPopularPage([FromBody] Content_BindPopularPageDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_TopOnePopularPages(new _Plumb5MLPageAnalysisPopularPage()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = 1,
                        End = 1
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindPageViewUniqueVisitorData([FromBody] Content_BindPageViewUniqueVisitorDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                HttpContext.Session.SetString("pageanalysis", details.pagename);

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageViewUniqueVisitor(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<ActionResult> BindGraph([FromBody] Content_BindGraphDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                HttpContext.Session.SetString("pageanalysis", details.pagename);

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisTotalVisit(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> PageAnalysisExport([FromBody] Content_PageAnalysisExportDto details)
        {
            DataSet dataSet = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.AccountId, SQLProvider).Result;
                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    dataSet = await objDL.Select_PageAnalysisCommon(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.AccountId,
                        Duration = details.Duration,
                        FromDate = details.FromDateTime,
                        ToDate = details.TodateTime,
                        Start = details.OffSet,
                        End = details.FetchNext,
                        Key = "TotalVisits",
                        PageName = HttpContext.Session.GetString("pageanalysis").ToString()
                    });
                }

                int RowNo = 1;

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);

                var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                    select new
                                    {
                                        SLNo = RowNo++,
                                        Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Date"])).Value.Date,//dataRow["DateShort"].ToString(),
                                        TotalVisits = Convert.ToInt32(String.IsNullOrEmpty(dataRow["TotalVisit"].ToString()) ? "0" : dataRow["TotalVisit"]),
                                        Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Sessions"].ToString()) ? "0" : dataRow["Sessions"]),
                                        UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniquVisitors"].ToString()) ? "0" : dataRow["UniquVisitors"]),
                                        SourcesCount = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Source"].ToString()) ? "0" : dataRow["Source"]),
                                        CitiesCount = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Cities"].ToString()) ? "0" : dataRow["Cities"]),
                                        SingleVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["SingleVisitors"].ToString()) ? "0" : dataRow["SingleVisitors"]),
                                        RepeatVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["RepeatVisitors"].ToString()) ? "0" : dataRow["RepeatVisitors"]),
                                        ReturningVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["ReturningVisitors"].ToString()) ? "0" : dataRow["ReturningVisitors"]),
                                        AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                    }).CopyToDataTableExport();

                DataSet resultDataSet = new DataSet();
                resultDataSet.Tables.Add(objDataTable);

                string FileName = "AnalyticsPopularPage_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
                //string MainPath = "E:/" + FileName;

                if (details.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(resultDataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(resultDataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> OverallPercentage([FromBody] Content_OverallPercentageDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                HttpContext.Session.SetString("pageanalysis", details.pagename);

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisOverallPercentage(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.deviceType
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SearchKeysForPageMethod([FromBody] Content_SearchKeysForPageMethodDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_SearchKeysForPage(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.Url,
                        Start = details.start,
                        End = details.end
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindPieCharts([FromBody] Content_BindPieChartsDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.SelectPageAnalysisSource(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> BindLocation([FromBody] Content_BindLocationDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_PageAnalysisCommonCitySource(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        Key = "City",
                        Start = 1,
                        End = 200
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<ActionResult> BindSourceGrid([FromBody] Content_BindSourceGridDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_PageAnalysisSource(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        Key = "Source",
                        devicetype = details.devicetype,
                        Start = details.start,
                        End = details.end
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindCityGrid([FromBody] Content_BindCityGridDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_PageAnalysisCity(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        Key = "City",
                        devicetype = details.devicetype,
                        Start = details.start,
                        End = details.end
                    });
                }

                ds = new CommonFunction().Decode((DataSet)ds);
                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        //[OutputCache(Duration = 300)]
        public async Task<ActionResult> GetTopEntryExitPagesCount([FromBody] Content_GetTopEntryExitPagesCountDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    _Plumb5MLEntryandExit objMl = new _Plumb5MLEntryandExit
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Key = details.key,
                        Duration = details.duration

                    };
                    ds = await objDL.Select_EntryandExitPageCount(objMl);
                }

                ds = new CommonFunction().Decode((DataSet)ds);
                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> GetTopEntryExitPages([FromBody] Content_GetTopEntryExitPagesCountDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                #region OutputCache Current TodateTime
                if (details.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    _Plumb5MLEntryandExit objMl = new _Plumb5MLEntryandExit
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = 1,
                        End = 10,
                        Key = details.key,
                        Duration = details.duration
                    };

                    ds = await objDL.Select_EntryandExitPage(objMl);
                }

                HttpContext.Session.SetString("TopEntryExitPages", details.key);
                ds = new CommonFunction().Decode((DataSet)ds);
                var getdata = JsonConvert.SerializeObject(new { ds, CurrentUTCDateTimeForOutputCache }, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> ExportTopEntryExitPages([FromBody] Content_ExportTopEntryExitPagesDto details)
        {
            string FileName = String.Empty;
            string MainPath = String.Empty;
            DataSet dataSet1 = new DataSet();
            DataSet dataSet = new DataSet();

            if (!String.IsNullOrEmpty(HttpContext.Session.GetString("TopEntryExitPages").ToString()))
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.AccountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    _Plumb5MLEntryandExit objMl = new _Plumb5MLEntryandExit
                    {
                        AccountId = details.AccountId,
                        FromDate = details.FromDateTime,
                        ToDate = details.TodateTime,
                        Start = details.OffSet,
                        End = details.FetchNext,
                        Key = HttpContext.Session.GetString("TopEntryExitPages").ToString(),
                        Duration = details.Duration
                    };
                    dataSet = await objDL.Select_EntryandExitPage(objMl);
                }

                if (HttpContext.Session.GetString("TopEntryExitPages").ToString().ToLower().Contains("entry"))
                {
                    FileName = "AnalyticsEntrypages_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
                    int RowNo = 1;
                    var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                        select new
                                        {
                                            SLNo = RowNo++,
                                            PageName = Convert.ToString(dataRow["PageName"]),
                                            PageViews = Convert.ToInt32(dataRow["PageViews"]),
                                            UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisits"]),
                                            City = Convert.ToString(dataRow["MaxVisitedCity"])
                                        }).CopyToDataTableExport();

                    dataSet1.Tables.Add(objDataTable);
                }
                else if (HttpContext.Session.GetString("TopEntryExitPages").ToString().ToLower().Contains("exit"))
                {
                    FileName = "AnalyticsExitpages_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
                    int RowNo = 1;
                    var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                        select new
                                        {
                                            SLNo = RowNo++,
                                            PageName = Convert.ToString(dataRow["PageName"]),
                                            PageViews = Convert.ToInt32(dataRow["PageViews"]),
                                            UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisits"]),
                                            BounceRate = Convert.ToString(Math.Round(Convert.ToDecimal(dataRow["BounceRate"]))) + "%",
                                            City = Convert.ToString(dataRow["MaxVisitedCity"])
                                        }).CopyToDataTableExport();

                    dataSet1.Tables.Add(objDataTable);
                }

                MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet1, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet1, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false, MainPath });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetPageFilters([FromBody] Content_GetPageFiltersDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_PageFilters(new _Plumb5MLEntryandExit()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = details.start,
                        End = details.end,
                        Key = details.filterPage
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetEventTrackingReportCount([FromBody] Content_GetEventTrackingReportCountDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetEventTrackingReportCount(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        drpSearchBy = details.drpSearchBy,
                        SearchTextValue = details.txtSearchBy
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindEventTrackingReport([FromBody] Content_BindEventTrackingReportDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_EventTrackingReport(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = details.start,
                        End = details.end,
                        drpSearchBy = details.drpSearchBy,
                        SearchTextValue = details.txtSearchBy
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { ds, CurrentUTCDateTimeForOutputCache }, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetEventValueMaxCount([FromBody] Content_GetEventValueMaxCountDto details)
        {
            int returnVal;
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    returnVal = await objDL.GetEventValueMaxCount(new _Plumb5MLEventTracking()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Events = details.Events
                    });
                }
                return Json(new { returnVal });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindEventValueReport([FromBody] Content_BindEventValueReportDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.EventValueReport(new _Plumb5MLEventTracking()
                    {
                        Names = details.eventName,
                        Events = details.events,
                        EventType = details.eventType,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        Start = details.OffSet,
                        End = details.FetchNext
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { ds, CurrentUTCDateTimeForOutputCache }, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<ActionResult> BindEventTrackingFilterValues([FromBody] Content_BindEventTrackingFilterValuesDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.BindEventTrackingFilterValues(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        drpSearchBy = details.drpSearchBy
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindExistingEventTrackSetting([FromBody] Content_BindExistingEventTrackSettingDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_ExistingEventTrackSetting(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveEventTrackSetting([FromBody] Content_SaveEventTrackSettingDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.SaveEventTrackSetting(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        Names = details.Names,
                        Events = details.Events,
                        EventType = details.EventType,
                        Action = details.Action
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateEventTrackSetting([FromBody] Content_UpdateEventTrackSettingDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.UpdateEventTrackSetting(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        Names = details.Names,
                        Events = details.Events,
                        EventType = details.EventType,
                        Action = details.Action,
                        Id = details.Id
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<ActionResult> UpdateStatus([FromBody] Content_UpdateStatusDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.UpdateStatus(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        Id = details.Id,
                        Status = details.Status
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<ActionResult> DeleteEventTrackSetting([FromBody] Content_DeleteEventTrackSettingDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.DeleteEventTrackSetting(new _Plumb5MLEventTracking()
                    {
                        AccountId = details.accountId,
                        Action = details.Action,
                        Id = details.Id
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> RecommendationReport([FromBody] Content_RecommendationReportDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.RecommendationReport(new MLRecommendation()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        [RequestFormLimits(ValueCountLimit = int.MaxValue)]
        public async Task<JsonResult> GetHeatMap([FromBody] Content_GetHeatMapDto details)
        {
            try
            {
                DataSet ds = new DataSet();
                var webClient = new WebClient();
                var domainurl = details.Page;
                if (!domainurl.Contains("http://"))
                    domainurl = "http://" + domainurl + "/";
                var myUri = new Uri(domainurl);
                var host = "http://" + myUri.Host + "/";
                var absoluteUri = myUri.AbsoluteUri;
                var domain = myUri.Host.Replace("www.", "");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var file = webClient.DownloadString(domainurl);
                file = file.Replace("%20", " ").Replace("href=\"..", "href\"3").Replace("href=\".", "href\"4").Replace("href=\'..", "href\'3").Replace("href=\'.", "href\'4");//.Replace("href=\"/", "href=\"");
                file = file.Replace("src=\"..", "src\"3").Replace("src=\".", "src\"4").Replace("src=\'..", "src\'3").Replace("src=\'.", "src\'4");
                var getString = Find(file, domain);
                int pos = absoluteUri.LastIndexOf('/');
                if (pos > 0)
                {
                    absoluteUri = absoluteUri.Substring(0, pos);
                }
                string[] arPages = getString.Select(i => i.Href.ToString()).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
                if (details.accountId == 1585)
                {
                    for (int i = 0; i < arPages.Length; i++)
                    {
                        arPages[i] = arPages[i].Replace("/", "/smartstore/ecom/");
                    }
                }
                //server call...............
                var dt = new DataTable();
                dt.Columns.Add("PageUrl", typeof(string));
                foreach (var data in arPages)
                    try
                    {
                        dt.Rows.Add(data);
                    }
                    catch
                    {

                    }

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_HeatMap(new MLHeatMap()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        ListData = dt
                    });
                }

                if (getString.Count == 0)
                    file = "The Requested url cannot be loaded. Try with a new one";
                else
                {
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (LinkItem i in Find(file, domain))
                        {
                            try
                            {
                                var hrefUrl = i.Href;
                                hrefUrl = hrefUrl.Replace("p5beta.plumb5.com/", "");
                                hrefUrl = hrefUrl.Contains("http://") ? hrefUrl.Substring("http://".Length) : hrefUrl;
                                hrefUrl = hrefUrl.Contains("https://") ? hrefUrl.Substring("https://".Length) : hrefUrl;
                                hrefUrl = hrefUrl.Contains("www.") ? hrefUrl.Substring("www.".Length) : hrefUrl;
                                ds.Tables[0].DefaultView.RowFilter = "PageName like '%" + hrefUrl + "%'";
                                var dv = ds.Tables[0].DefaultView;
                                if (dv.Count > 0)
                                    file = file.Replace(i.HrefTag,
                                        i.HrefTag + "<p5HeatMap onplay='" + dv[0][1].ToString().Replace(":", "") +
                                        " => " + i.Href + "'id='heatCount' class='heatCount'>" + dv[0][2] + "</p5HeatMap>");
                            }
                            catch
                            {
                                // ignored
                            }
                        }
                    }
                    file = file.Replace("href='http", "href2='http").Replace("href=\"http", "href2=\"http").Replace("href='//", "href2='//").Replace("href=\"//", "href2=\"//");
                    file = file.Replace("src='http", "src2='http").Replace("src=\"http", "src2=\"http").Replace("src='//", "src2='//").Replace("src=\"//", "src2=\"//");

                    //
                    absoluteUri = absoluteUri + '/';
                    file = file.Replace("href=\"", "href=\"" + absoluteUri).Replace("href=\'", "href=\'" + absoluteUri);
                    file = file.Replace("src=\"", "src=\"" + absoluteUri).Replace("src=\'", "src=\'" + absoluteUri);

                    file = file.Replace("href\"3", "href=\"" + host).Replace("href\'3", "href=\'" + host).Replace("href\"4", "href=\"" + host).Replace("href\'4", "href=\'" + host);
                    file = file.Replace("src\"3", "src=\"" + host).Replace("src\'3", "src=\'" + host).Replace("src\"4", "src=\"" + host).Replace("src\'4", "src=\'" + host);

                    file = file.Replace("href2=", "href=").Replace("src2=", "src=");
                    file = file.Replace("https://www.google-analytics.com/analytics.js", "").Replace("http://www.google-analytics.com/analytics.js", "").
                        Replace("p5s.parentNode.insertBefore(p5, p5s)", "");
                    string onlineUrl = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"].ToString();
                }
                var jsonResult = Json(file);
                return jsonResult;
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetHeatMapNew([FromBody] Content_GetHeatMapNewDto details)
        {
            try
            {
                DataSet ds = new DataSet();
                var domainurl = details.Page;// "http://www.knorrox.co.za/recipes/"; ////"http://www.aromat.co.za";//"";

                if (!domainurl.Contains("http://") && !domainurl.Contains("https://"))
                    domainurl = "http://" + domainurl + "/";
                var myUri = new Uri(domainurl);
                var host = "";
                if (domainurl.Contains("https://"))
                    host = "https://" + myUri.Host + "/";
                else
                    host = "http://" + myUri.Host + "/";

                var domain = myUri.Host.Replace("www.", "");
                var file = await DownloadPageAsync(domainurl);

                if (file == "") return null;
                ///
                file = file.Replace("%20", " ").Replace("href=\"..", "href\"3").Replace("href=\".", "href\"4").Replace("href=\'..", "href\'3").Replace("href=\'.", "href\'4");//.Replace("href=\"/", "href=\"");
                file = file.Replace("src=\"..", "src\"3").Replace("src=\".", "src\"4").Replace("src=\'..", "src\'3").Replace("src=\'.", "src\'4");
                file = file.Replace("href\"3", "href=\"" + host).Replace("href\'3", "href=\'" + host).Replace("href\"4", "href=\"" + host).Replace("href\'4", "href=\'" + host);
                var getString = Find(file, domain);
                string[] arPages = getString.Select(i => i.Href.ToString()).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
                //server call...............
                var dt = new DataTable();
                dt.Columns.Add("PageUrl", typeof(string));
                foreach (var data in arPages)
                {
                    try
                    {
                        dt.Rows.Add(data);
                    }
                    catch
                    {
                    }
                }

                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_HeatMap(new MLHeatMap()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        ListData = dt
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                return Content("Message : " + ex.Message + ", Stack Trace : " + ex.StackTrace);
            }
        }

        private static async Task<string> DownloadPageAsync(string page)
        {
            // ... Use HttpClient.
            using (var client = new System.Net.Http.HttpClient())
            using (var response = await client.GetAsync(page))
            using (var content = response.Content)
            {
                // ... Read the string.
                string result = await content.ReadAsStringAsync();
                // ... Display the result.
                if (result != null && result.Length >= 10)
                {
                    return result;
                }
            }
            return "";
        }


        public static List<LinkItem> Find(string file, string host)
        {
            //string HeatMapPageUrs = "";
            List<LinkItem> list = new List<LinkItem>();

            // 1. 
            // Find all matches in file.
            MatchCollection m1 = Regex.Matches(file, @"(<a.*?>.*?</a>)", RegexOptions.Singleline);

            // 2.
            // Loop over each match.
            foreach (System.Text.RegularExpressions.Match m in m1)
            {
                string value = m.Groups[1].Value;
                LinkItem i = new LinkItem();

                // 3.
                // Get href attribute.
                System.Text.RegularExpressions.Match m2 = Regex.Match(value, @"href=\""(.*?)\""", RegexOptions.Singleline);
                if (m2.Success && m2.Groups[1].Value != "" && m2.Groups[1].Value.Contains("javascript") == false && m2.Groups[1].Value.Contains("mailto") != true)
                {
                    i.Href = m2.Groups[1].Value.Contains("http") == true ? m2.Groups[1].Value : (m2.Groups[1].Value.StartsWith("/") ? host + m2.Groups[1].Value : host + "/" + m2.Groups[1].Value);

                    // 4.
                    // Remove inner tags from text.
                    string t = Regex.Replace(value, @"\s*<.*?>\s*", "", RegexOptions.Singleline);
                    i.Text = t;

                    i.HrefTag = value.Substring(0, value.IndexOf('>') + 1);

                    if (!list.Any(a => a.HrefTag == value.Substring(0, value.IndexOf('>') + 1)))
                        list.Add(i);
                }
            }
            return list;
        }

        public struct LinkItem
        {
            public string HrefTag;
            public string Href;
            public string Text;
            public override string ToString()
            {
                return Href + "\n\t" + Text;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetPageName([FromBody] Content_GetPageNameDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_TopOnePages(new MLHeatMap()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate
                    });
                }
                ds = new CommonFunction().Decode(ds);
                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetLeadSourceMaxInnerCount([FromBody] Content_GetLeadSourceMaxInnerCountDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetLeadSourceMaxInnerCount(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype,
                        Key = "LeadSourceMaxCount",
                        LeadSource = details.LeadSource
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetLeadSource([FromBody] Content_GetLeadSourceDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisLeadSource(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetLeadDetails([FromBody] Content_GetLeadDetailsDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.Select_PageAnalysisCommon(new _Plumb5MLPageAnalysis()
                    {
                        AccountId = details.accountId,
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype,
                        Key = "LeadSourceDetails",
                        LeadSource = details.LeadSource,
                        Start = details.OffSet,
                        End = details.FetchNext
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetTimeSpentData([FromBody] Content_GetTimeSpentDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisTimeSpent(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.deviceType
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetTimeTrendsData([FromBody] Content_GetTimeTrendsDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisTimeTrends(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetFrequencyData([FromBody] Content_GetFrequencyDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(details.accountId, SQLProvider).Result;

                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    ds = await objDL.GetPageAnalysisFrequency(new _Plumb5MLPageAnalysis()
                    {
                        FromDate = details.fromdate,
                        ToDate = details.todate,
                        PageName = details.pagename,
                        devicetype = details.devicetype
                    });
                }

                var getdata = await Task.FromResult(JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented));
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> GetPopularPagesCount([FromBody] Content_GetPopularPagesCountDto ContentDto)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(ContentDto.accountId, SQLProvider);
                object PopularPageData = null;
                using (var objDL = DLContent.GetDLContent(ConnectionStr, SQLProvider))
                {
                    PopularPageData = await objDL.Select_AllPopularPagesCount(new _Plumb5MLPopularPages
                    {
                        AccountId = ContentDto.accountId,
                        Duration = ContentDto.duration,
                        FromDate = ContentDto.fromdate,
                        ToDate = ContentDto.todate,
                    });
                }

                var getdata = JsonConvert.SerializeObject(PopularPageData, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
       
       
    }
}


