using MathNet.Numerics.LinearAlgebra.Factorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Net;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class AudienceController : BaseController
    {
        private string CurrentUTCDateTimeForOutputCache = "";
        public AudienceController(IConfiguration _configuration) : base(_configuration)
        { }

        // GET: /Analytics/Audience/
        public ActionResult Network()
        { return View(); }
        public ActionResult Devices()
        { return View(); }
        public ActionResult AllDevices()
        { return View(); }
        public ActionResult Browser()
        { return View(); }
        public ActionResult PageDepth()
        { return View(); }
        public ActionResult TimeSpend()
        { return View(); }
        public ActionResult RecencyReturning()
        { return View(); }
        public ActionResult Recency()
        { return View(); }
        public ActionResult Frequency()
        { return View(); }
        public ActionResult AllCities()
        { return View(); }
        public ActionResult Cities()
        { return View(); }
        public ActionResult Visitors()
        { return View(); }
        public ActionResult AllBrowsers()
        { return View(); }


        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetVisitorsReportCount([FromBody] GetVisitorsReportCountDto getVisitorsReport)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(getVisitorsReport.accountId, SQLProvider);
                object ds = null;
                using (var objDL = DLAudience.GetDLAudience(getVisitorsReport.accountId, SQLProvider))
                {
                    ds = await objDL.GetVisitorReportCount(new _Plumb5MLGetVisitors
                    {
                        AccountId = getVisitorsReport.accountId,
                        Duration = getVisitorsReport.duration,
                        FromDate = getVisitorsReport.fromdate,
                        ToDate = getVisitorsReport.todate,
                        drpSearchBy = getVisitorsReport.drpSearchBy,
                        SearchTextValue = getVisitorsReport.txtSearchBy
                    });
                }


                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> BindVisitors([FromBody] BindVisitorsDto bindVisitors)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                ArrayList filterdata = new ArrayList() { bindVisitors.drpSearchBy, bindVisitors.txtSearchBy };

                HttpContext.Session.SetString("FilterSelectedData", JsonConvert.SerializeObject(filterdata));

                #region OutputCache Current TodateTime
                if (bindVisitors.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                System.Data.DataSet VisitorsData = new System.Data.DataSet("General");
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    VisitorsData =await  objDL.Select_GetVisitors(new _Plumb5MLGetVisitors
                    {
                        AccountId = bindVisitors.accountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        Start = bindVisitors.start,
                        End = bindVisitors.end,
                        drpSearchBy = bindVisitors.drpSearchBy,
                        SearchTextValue = bindVisitors.txtSearchBy
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { VisitorsData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }

        [HttpPost]
        public async Task<ActionResult> BindFilterValues([FromBody] BindFilterValuesDto bindVisitors)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                object ds = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds =await objDL.BindFilterValues(new _Plumb5MLGetVisitors
                    {
                        AccountId = bindVisitors.accountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        drpSearchBy = bindVisitors.drpSearchBy,
                        SearchTextValue = bindVisitors.txtSearchBy
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
        public async Task<JsonResult> VisitorsExport([FromBody] VisitorsExportDto bindVisitors)
        {
            string? drpSearchBy = "", txtSearchBy = "";
            string? filterdatas = HttpContext.Session.GetString("FilterSelectedData");
            if (!String.IsNullOrEmpty(filterdatas))
            {
                ArrayList? filterdata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("FilterSelectedData"));
                drpSearchBy = filterdata[0].ToString();
                txtSearchBy = filterdata[1].ToString();

            }
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                try {
                    dataSet = (DataSet)await objDL.Select_GetVisitors(new _Plumb5MLGetVisitors
                    {
                        AccountId = bindVisitors.AccountId,
                        Duration = bindVisitors.Duration,
                        FromDate = bindVisitors.FromDateTime,
                        ToDate = bindVisitors.TodateTime,
                        Start = bindVisitors.OffSet,
                        End = bindVisitors.FetchNext,
                        drpSearchBy = drpSearchBy,
                        SearchTextValue = txtSearchBy
                    });
                }
                catch(Exception ex)
                {

                }
                
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(bindVisitors.AccountId, SQLProvider);

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             IpAddress = Convert.ToString(dataRow["VisitorIp"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             AvgTimeSpent = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"])),
                                             LastInteractioDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dataRow["Recency"]))).ToString(),
                                             RecentVisitedPages = Convert.ToString(dataRow["PageName"]),
                                             City = dataRow["City"].ToString(),
                                         }).CopyToDataTableExport();

            DataSet data = new DataSet();
            data.Tables.Add(resultDataTable);
            string FileName = "AnalyticsWebVisitors_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(data, MainPath);
            else
                Helper.SaveDataSetToExcel(data, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new
            {
                Status = true,
                MainPath
            });
        }

        /// <summary>
        /// Network
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> NetworkReport([FromBody] NetworkReportDto bindVisitors)
        {
            try
            {
                #region OutputCache Current TodateTime
                if (bindVisitors.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                DataSet NetworkData;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    NetworkData = (DataSet)await objDL.Select_NetworkDetails(new _Plumb5MLGetNetwork
                    {
                        Duration = bindVisitors.duration,
                        FromDate = Convert.ToDateTime(bindVisitors.fromdate),
                        ToDate = Convert.ToDateTime(bindVisitors.todate),
                        Start = bindVisitors.startcount,
                        End = bindVisitors.endcount
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { NetworkData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> NetworkReportCount([FromBody] NetworkReportCountDto bindVisitors)
        {
            try
            {
                string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                DataSet NetworkData;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    NetworkData = (DataSet)await objDL.Select_NetworkDetailsCount(new _Plumb5MLGetNetwork
                    {
                        Duration = bindVisitors.duration,
                        FromDate = Convert.ToDateTime(bindVisitors.fromdate),
                        ToDate = Convert.ToDateTime(bindVisitors.todate),
                    });
                }

                var getdata = JsonConvert.SerializeObject(NetworkData, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> NetworkExport([FromBody] NetworkExportDto bindVisitors)
        {
            string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            DataSet NetworkData;
            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                NetworkData = (DataSet)await objDL.Select_NetworkDetails(new _Plumb5MLGetNetwork
                {
                    Duration = bindVisitors.Duration,
                    FromDate = Convert.ToDateTime(bindVisitors.FromDateTime),
                    ToDate = Convert.ToDateTime(bindVisitors.TodateTime),
                    Start = bindVisitors.OffSet,
                    End = bindVisitors.FetchNext
                });
            }

            DataTable resultDataTable = (from dataRow in NetworkData.Tables[0].Select()
                                         select new
                                         {
                                             Day = Convert.ToDateTime(dataRow["LocalDate"]).Date,
                                             Network = Convert.ToString(dataRow["Network"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"])),
                                             PageViews = Convert.ToString(dataRow["PageViews"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisits"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),

                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsNetwork_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        //[OutputCache]
        public async Task<ActionResult> DeviceReportCount([FromBody] DeviceReportCountDto bindVisitors)
        {
            try
            {
                string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                DataSet ds;
                DataSet ReturnDataSet = new DataSet();
                var ReturnDataTable = new DataTable
                {
                    Columns = { { "TotalRows", typeof(int) } }
                };
                ReturnDataTable.Rows.Add(0);
                ReturnDataSet.Tables.Add(ReturnDataTable);
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_DeviceDetailsCount(new _Plumb5MLGetDevices
                    {
                        FromDate = Convert.ToDateTime(bindVisitors.fromdate),
                        ToDate = Convert.ToDateTime(bindVisitors.todate)
                    });
                }

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                    List<DeviceInfo> deviceInfoDataList;
                    using (var objDL = DLDeviceInfo.GetDLDeviceInfo(SQLProvider))
                    {
                        deviceInfoDataList = await objDL.GetDeviceInfoByDeviceId(ListOfDeviceIds);
                    }

                    if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                    {
                        var results = (from SessionData in ds.Tables[0].AsEnumerable()
                                       join DeviceData in deviceInfoDataList on (int)SessionData["DeviceId"] equals DeviceData.DId
                                       select new
                                       {
                                           DeviceId = DeviceData.DId

                                       }).ToList();

                        if (results != null && results.Count > 0)
                        {
                            ReturnDataSet.Tables[0].Rows[0][0] = results.Count;
                        }
                    }
                }

                var getdata = JsonConvert.SerializeObject(ReturnDataSet, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        //[OutputCache]
        public async Task<ActionResult> DeviceReport([FromBody] DeviceReportDto bindVisitors)
        {
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
                DataSet ds;
                DataSet ReturnDataSet = new DataSet();
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_DeviceDetails(new _Plumb5MLGetDevices
                    {
                        FromDate = Convert.ToDateTime(bindVisitors.fromdate),
                        ToDate = Convert.ToDateTime(bindVisitors.todate),
                        startcount = bindVisitors.start,
                        endcount = bindVisitors.end
                    });
                }

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                    List<DeviceInfo> deviceInfoDataList;
                    using (var objDL = DLDeviceInfo.GetDLDeviceInfo(SQLProvider))
                    {
                        deviceInfoDataList = await objDL.GetDeviceInfoByDeviceId(ListOfDeviceIds);
                    }

                    if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                    {
                        var results = (from SessionData in ds.Tables[0].AsEnumerable()
                                       join DeviceData in deviceInfoDataList on (int)SessionData["DeviceId"] equals DeviceData.DId
                                       select new MLDeviceinfoData
                                       {
                                           DeviceId = DeviceData.DId,
                                           //Device = string.IsNullOrWhiteSpace(
                                           //    ((string.IsNullOrEmpty(DeviceData.BrandName) ? "" : DeviceData.BrandName) + " " +
                                           //    (string.IsNullOrEmpty(DeviceData.ModelName) ? "" : DeviceData.ModelName))) ?
                                           //    ((string.IsNullOrEmpty(DeviceData.BrandName) ? "" : DeviceData.BrandName) + " " +
                                           //    (string.IsNullOrEmpty(DeviceData.ModelName) ? "" : DeviceData.ModelName)) : "Unknown",
                                           Device = DeviceData.BrandName + " " + DeviceData.ModelName,
                                           PageViews = (long)SessionData["PageViews"],
                                           Session = (long)SessionData["Session"],
                                           UniqueVisitors = (long)SessionData["UniqueVisitors"],
                                           AvgTime = (long)SessionData["AvgTime"]
                                       }).CopyToDataTable();

                        if (results != null && results.Rows.Count > 0)
                        {
                            ReturnDataSet.Tables.Add(results);
                        }
                    }
                }

                var getdata = JsonConvert.SerializeObject(new { ReturnDataSet, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                return null;
            }
        }



        [HttpPost]
        public async Task<JsonResult> DeviceExport([FromBody] DeviceExportDto bindVisitors)
        {
            string ConnectionString = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            DataSet ds;
            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                ds = (DataSet)await objDL.Select_DeviceDetails(new _Plumb5MLGetDevices
                {
                    FromDate = Convert.ToDateTime(bindVisitors.FromDateTime),
                    ToDate = Convert.ToDateTime(bindVisitors.TodateTime),
                    startcount = bindVisitors.OffSet,
                    endcount = bindVisitors.FetchNext
                });
            }

            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                List<DeviceInfo> deviceInfoDataList;
                using (var objDL = DLDeviceInfo.GetDLDeviceInfo(SQLProvider))
                {
                    deviceInfoDataList = await objDL.GetDeviceInfoByDeviceId(ListOfDeviceIds);
                }

                if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                {
                    var resultDataTable = (from SessionData in ds.Tables[0].AsEnumerable()
                                           join DeviceData in deviceInfoDataList on (int)SessionData["DeviceId"] equals DeviceData.DId
                                           select new
                                           {
                                               Brand =
                                                 string.IsNullOrWhiteSpace(string.IsNullOrEmpty((string.IsNullOrEmpty(DeviceData.BrandName) ? "" : DeviceData.BrandName) + " " + (string.IsNullOrEmpty(DeviceData.ModelName) ? "" : DeviceData.ModelName)) ? "Unknown" : (DeviceData.BrandName + " " + DeviceData.ModelName)) ? "Unknown" : (DeviceData.BrandName + " " + DeviceData.ModelName),
                                               PageViews = Convert.ToString((long)SessionData["PageViews"]),
                                               Sessions = Convert.ToString((long)SessionData["Session"]),
                                               UniqueVisitors = Convert.ToString((long)SessionData["UniqueVisitors"]),
                                               AverageTime = Helper.AverageTime(Convert.ToDecimal((long)SessionData["AvgTime"]))
                                           }).CopyToDataTable();

                    DataSet resultDataSet = new DataSet();
                    resultDataSet.Tables.Add(resultDataTable);

                    string FileName = "AnalyticsDevice_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (bindVisitors.FileType.ToLower() == "csv")
                        Helper.SaveDataSetToCSV(resultDataSet, MainPath);
                    else
                        Helper.SaveDataSetToExcel(resultDataSet, MainPath);

                    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                    return Json(new { Status = true, MainPath });
                }
            }
            return Json(new { Status = true, MainPath = "" });
        }

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> BrowserReportCount([FromBody] BrowserReportCountDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
            try
            {
                object? ds = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds = await objDL.Select_BrowserReportCount(new _Plumb5MLBrowsersDetails
                    {
                        AccountId = bindVisitors.accountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="duration"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> BrowserReport([FromBody] BrowserReportDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                object BrowserData = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    BrowserData = await objDL.Select_BrowserDetailsWithDateRange(new _Plumb5MLBrowsersDetails
                    {
                        AccountId = bindVisitors.AccountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        startcount = bindVisitors.start,
                        endcount = bindVisitors.end
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { BrowserData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> BrowserExport([FromBody] BrowserExportDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            DataSet dataSet = null;
            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_BrowserDetailsWithDateRange(new _Plumb5MLBrowsersDetails
                {
                    AccountId = bindVisitors.AccountId,
                    Duration = bindVisitors.Duration,
                    FromDate = bindVisitors.FromDateTime,
                    ToDate = bindVisitors.TodateTime,
                    startcount = bindVisitors.OffSet,
                    endcount = bindVisitors.FetchNext
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Browser = dataRow["Browser"].ToString(),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AnalyticsBrowser_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetPageDepth([FromBody] GetPageDepthDto bindVisitors)
        {

            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                object PageDepthData = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    PageDepthData = await objDL.Select_PageDepth(new _Plumb5MLPageDepth
                    {
                        AccountId = bindVisitors.AccountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { PageDepthData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }

        [HttpPost]
        public async Task<JsonResult> PageDepthExport([FromBody] PageDepthExportDto bindVisitors)
        {
            DataSet dataSet = null;
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);

            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_PageDepth(new _Plumb5MLPageDepth
                {
                    AccountId = bindVisitors.AccountId,
                    Duration = bindVisitors.Duration,
                    FromDate = bindVisitors.FromDateTime,
                    ToDate = bindVisitors.TodateTime
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    PageDepth = dataRow["Depth"].ToString(),
                                    Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Session"].ToString()) ? "0" : dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AnalyticsPageDepth_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// Time Spend
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetTimeSpend([FromBody] GetTimeSpendDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                object TimeSpendData = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    TimeSpendData = await objDL.Select_TimeSpend(new _Plumb5MLTimeSpend
                    {
                        AccountId = bindVisitors.AccountId,
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { TimeSpendData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }

        [HttpPost]
        public async Task<JsonResult> TimeSpendExport([FromBody] TimeSpendExportDto bindVisitors)
        {
            DataSet dataSet = null;
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);

            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_TimeSpend(new _Plumb5MLTimeSpend
                {
                    AccountId = bindVisitors.AccountId,
                    Duration = bindVisitors.Duration,
                    FromDate = bindVisitors.FromDateTime,
                    ToDate = bindVisitors.TodateTime
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    TimeSpend = dataRow["Time"].ToString(),
                                    Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Session"].ToString()) ? "0" : dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AnalyticsTimeSpend_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        //[OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetCities([FromBody] GetCitiesDto bindVisitors)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
                object CityData = null;

                #region OutputCache Current TodateTime
                if (bindVisitors.duration == 1)
                    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    _Plumb5MLCity objMl = new _Plumb5MLCity
                    {
                        AccountId = bindVisitors.AccountId,
                        Start = bindVisitors.start,
                        End = bindVisitors.end,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        Duration = bindVisitors.duration
                    };
                    CityData = await objDL.Select_Location_CityDetails(objMl);
                }

                var getdata = JsonConvert.SerializeObject(new { CityData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetCityMapData([FromBody] GetCityMapDataDto bindVisitors)
        {
            try
            {
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
                var ds = new object();
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    _Plumb5MLCity objMl = new _Plumb5MLCity
                    {
                        AccountId = bindVisitors.AccountId,
                        Start = 0,
                        End = 0,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        Duration = bindVisitors.duration
                    };
                    ds = await objDL.Select_Location_CityMapDetails(objMl);
                }

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        // [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetCityMaxCount([FromBody] GetCityMaxCountDto bindVisitors)
        {
            try
            {
                var ds = new object();
                string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    _Plumb5MLCity objMl = new _Plumb5MLCity
                    {
                        AccountId = bindVisitors.AccountId,
                        Start = 0,
                        End = 0,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate,
                        Duration = bindVisitors.duration
                    };
                    ds = await objDL.Select_Location_CityDetails_MaxCount(objMl);
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
        public async Task<JsonResult> WebCityExport([FromBody] WebCityExportDto bindVisitors)
        {
            DataSet dataSet;
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);
            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                _Plumb5MLCity objMl = new _Plumb5MLCity
                {
                    AccountId = bindVisitors.AccountId,
                    Start = bindVisitors.OffSet,
                    End = bindVisitors.FetchNext,
                    FromDate = bindVisitors.FromDateTime,
                    ToDate = bindVisitors.TodateTime,
                    Duration = bindVisitors.Duration
                };
                dataSet = (DataSet)await objDL.Select_Location_CityDetails(objMl);
            }


            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             City = Convert.ToString(dataRow["City"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisits"]),
                                             PageViews = Convert.ToString(dataRow["TotalVisits"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsWebCity_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// Frequency
        /// </summary>
        /// <param name="AdsId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetFrequencyReport([FromBody] GetFrequencyReportDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);

            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                object FrequencyData = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    FrequencyData = await objDL.Select_Frequency(new _Plumb5MLFrequency
                    {
                        Duration = bindVisitors.duration,
                        FromDate = bindVisitors.fromdate,
                        ToDate = bindVisitors.todate
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { FrequencyData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> FrequencyExport([FromBody] FrequencyExportDto bindVisitors)
        {
            DataSet dataSet;
            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_Frequency(new _Plumb5MLFrequency()
                {
                    AccountId = bindVisitors.AccountId,
                    Duration = bindVisitors.Duration,
                    FromDate = bindVisitors.FromDateTime,
                    ToDate = bindVisitors.TodateTime
                });
            }

            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             VisitCount = Convert.ToInt32(dataRow["Frequency"]),
                                             UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                             PageViews = Convert.ToInt32(String.IsNullOrEmpty(dataRow["TotalVisits"].ToString()) ? "0" : dataRow["TotalVisits"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["TotalTime"].ToString()) ? "0" : dataRow["TotalTime"])),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsFrequency_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// Recency
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetRecency([FromBody] GetRecencyDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.AccountId, SQLProvider);

            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                object RecencyData = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
                {
                    RecencyData = await objDL.Select_Recency(new _Plumb5MLRecency
                    {
                        Start = bindVisitors.OffSet,
                        End = bindVisitors.FetchNext
                    });
                }

                var getdata = JsonConvert.SerializeObject(new { RecencyData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> RecencyExport([FromBody] RecencyExportDto bindVisitors)
        {
            DataSet? dataSet = null;

            using (var objDL = DLAudience.GetDLAudience(bindVisitors.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_Recency(new _Plumb5MLRecency
                {
                    AccountId = bindVisitors.AccountId,
                    Start = bindVisitors.OffSet,
                    End = bindVisitors.FetchNext
                });
            }


            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Daysincelastvisit = dataRow["DaySince"].ToString(),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                    Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Session"].ToString()) ? "0" : dataRow["Session"]),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AnalyticsRecency_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + bindVisitors.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (bindVisitors.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> GetRecencyReturning([FromBody] GetRecencyReturningDto bindVisitors)
        {
            try
            {
                var ds = new object();
                if (bindVisitors.duration == 1 || bindVisitors.duration == 5)
                {
                    using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                    {
                        ds = (object)await objDL.Select_RecencyReturn(new _Plumb5MLRecencyReturn
                        {
                            AccountId = bindVisitors.accountId,
                            FromDate = bindVisitors.fromdate,
                            ToDate = bindVisitors.todate,
                            Start = bindVisitors.start,
                            End = bindVisitors.end
                        });
                    }
                }
                else
                {
                    MLCacheReportDetails cachereport = new MLCacheReportDetails()
                    {
                        Action = "RecencyReturning",
                        AccountId = bindVisitors.accountId,
                        Duration = bindVisitors.duration,
                        Start = bindVisitors.start,
                        End = bindVisitors.end
                    };

                    using (var obj = DLCacheReportDetails.GetDLCacheReportDetails(bindVisitors.accountId, SQLProvider))
                    {
                        ds = obj.GetCacheReportDetails(cachereport);
                    }
                }

                var getdata = JsonConvert.SerializeObject(Models.MaskEmailPhoneNumber.MaskEmailId((DataSet)ds), Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }

        }
        /// <summary>
        /// Get AutoSuggestion
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="key"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AutoSuggest([FromBody] AutoSuggestDto bindVisitors)
        {
            try
            {
                if (!CommonFunction.IsVulnerableContentForSql(bindVisitors.q))
                {
                    var inBetweenLimits = "";
                    switch (bindVisitors.type)
                    {
                        case "Recency":
                            inBetweenLimits = "{\"Table\": [{\"Value\": \"0 day\"},{\"Value\": \"1 day\"},{\"Value\": \"2 days\"},{\"Value\": \"3 days\"},{\"Value\": \"4 days\"},{\"Value\": \"5 days\"},{\"Value\": \"6 days\"},{\"Value\": \"7 days\"},{\"Value\": \"8-14 days\"},{\"Value\": \"15-30 days\"},{\"Value\": \"31-60 days\"},{\"Value\": \"61-120 days\"},{\"Value\": \"121-364 days\"},{\"Value\": \"More than 364 days\"}]}";
                            break;
                        case "Frequency":
                            inBetweenLimits = "{\"Table\": [{\"Value\": \"1\"},{\"Value\": \"2\"},{\"Value\": \"3\"},{\"Value\": \"4\"},{\"Value\": \"5\"},{\"Value\": \"6-10\"},{\"Value\": \"11-25\"},{\"Value\": \"26-99\"},{\"Value\": \"100 or more\"}]}";
                            break;
                        case "Score":
                            inBetweenLimits = "{\"Table\": [{\"Value\": \"1-5\"},{\"Value\": \"6-10\"},{\"Value\": \"11-25\"},{\"Value\": \"26-99\"},{\"Value\": \"100 or more\"}]}";
                            break;
                        default:
                            DataSet ds = null;
                            using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                            {
                                ds = await objDL.Select_SearchBy_AutoSuggest(new _Plumb5MLAutosuggest
                                {
                                    AccountId = bindVisitors.accountId,
                                    Type = bindVisitors.type,
                                    SearchText = bindVisitors.q
                                });
                            }

                            try
                            {
                                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Columns.Count > 0)
                                {
                                    for (int op = 0; op < ds.Tables[0].Rows.Count; op++)
                                    {
                                        if (ds.Tables[0].Rows[op][0].ToString() != null && !string.IsNullOrEmpty(ds.Tables[0].Rows[op][0].ToString()))
                                        {
                                            Type dataType = ds.Tables[0].Rows[op][0].GetType();
                                            if (dataType == typeof(string))
                                            {
                                                ds.Tables[0].Rows[op][0] = WebUtility.HtmlDecode(ds.Tables[0].Rows[op][0].ToString());
                                            }
                                        }
                                    }
                                }
                            }
                            catch
                            {

                            }

                            var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                            return Content(getdata.ToString(), "application/json");
                    }
                    //var getdata1 = JsonConvert.SerializeObject(inBetweenLimits, Formatting.Indented);
                    return Content(inBetweenLimits, "application/json");
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;//"No results found";
            }
        }
        /// <summary>
        /// Search By Click
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> SearchByOnclick([FromBody] SearchByOnclickDto bindVisitors)
        {
            try
            {
                var ds = (DataSet)await DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider).Select_SearchByOnclick(new _Plumb5MLSearchBy
                {
                    AccountId = bindVisitors.accountId,
                    FromDate = bindVisitors.fromdate,
                    ToDate = bindVisitors.todate,
                    Type = bindVisitors.drpSearchBy,
                    SearchBy = bindVisitors.txtSearchBy,
                    Start = bindVisitors.start,
                    End = bindVisitors.end,
                    VisitorSummary = bindVisitors.visitorSummary
                });
                var getdata = JsonConvert.SerializeObject(Models.MaskEmailPhoneNumber.MaskEmailId(ds), Formatting.Indented);
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
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> GetGroupNames([FromBody] GetGroupNamesDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
            try
            {
                object ds = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds = await objDL.Select_GroupNames();
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
        /// <param name="ips"></param>
        /// <param name="groupName"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] AddToGroupDto bindVisitors)
        {
            string ConnectionStr = await Plumb5.Models.AccountDetails.GetAccountConnection(bindVisitors.accountId, SQLProvider);
            try
            {
                var arContact = bindVisitors.contact.Split(',');
                var arMachine = bindVisitors.machine.Split(',');
                var dt = new DataTable();
                dt.Columns.Add("MachineId", typeof(string));
                dt.Columns.Add("ContactId", typeof(Int32));
                dt.Columns.Add("GroupId", typeof(Int32));
                for (var m = 0; m < arMachine.Length; m++)
                    dt.Rows.Add(arMachine[m], arContact[m] == "" ? "0" : arContact[m], bindVisitors.groupId);

                object ds = null;
                using (var objDL = DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Insert_AddToGroup(new _Plumb5MLGroupName
                    {
                        AccountId = bindVisitors.accountId,
                        ListData = dt
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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="mac"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> UpdateScore([FromBody] UpdateScoreDto bindVisitors)
        {
            try
            {
                var ds = await DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider).Update_Score(new _Plumb5MLUpdateScore
                {
                    AccountId = bindVisitors.accountId,
                    MachineId = bindVisitors.mac,
                    Key = bindVisitors.key
                });
                if (bindVisitors.key == "Single")
                    return Json(new { ds });
                else
                {
                    var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
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
        /// <param name="mac"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Transaction([FromBody] TransactionDto bindVisitors)
        {
            try
            {
                var ds = await DLAudience.GetDLAudience(bindVisitors.accountId, SQLProvider).Transaction(new _Plumb5MLUpdateScore
                {
                    AccountId = bindVisitors.accountId
                });
                return Json(new { ds });
            }
            catch
            {
                return null;
            }
        }
    }
}
