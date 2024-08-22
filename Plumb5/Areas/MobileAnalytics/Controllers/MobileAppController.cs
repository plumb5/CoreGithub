using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MobileAnalytics.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.MobileAnalytics.Controllers
{
    [Area("MobileAnalytics")]
    public class MobileAppController : BaseController
    {
        public MobileAppController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /MobileAnalytics/MobileApp/


        private static DataTable dt;
        private static DataTable Beacondt;
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public IActionResult Visits()
        {
            return View();
        }
        public IActionResult TimeOnMobile()
        {
            return View();
        }
        public IActionResult Frequency()
        {
            return View();
        }
        public IActionResult Recency()
        {
            return View();
        }
        public IActionResult TimeSpend()
        {
            return View();
        }
        public IActionResult EventTracking()
        {
            return View();
        }
        public IActionResult Device()
        {
            return View();
        }
        public IActionResult OperatingSystem()
        {
            return View();
        }
        public IActionResult AllEventTrackingMobile()
        {
            return View();
        }
        public IActionResult AllDevicesMobile()
        {
            return View();
        }
        public IActionResult AllOperatingSystemMobile()
        {
            return View();
        }
        public IActionResult UniqueVisits()
        {
            return View();
        }
        public IActionResult Visitors()
        {
            return View();
        }
        public IActionResult Cities()
        {
            return View();
        }
        public IActionResult AllCities()
        {
            return View();
        }
        public IActionResult Countries()
        {
            return View();
        }
        public IActionResult AllCountries()
        {
            return View();
        }
        public IActionResult Carrier()
        {
            return View();
        }
        public IActionResult ScreenResolution()
        {
            return View();
        }
        public IActionResult Geofence()
        {
            return View();
        }
        public IActionResult AllGeofence()
        {
            return View();
        }
        public IActionResult GeofenceSetting()
        {
            return View();
        }
        public IActionResult Beacon()
        {
            return View();
        }
        public IActionResult BeaconSetting()
        {
            return View();
        }
        public IActionResult NewReturn()
        {
            return View();
        }
        public IActionResult PopularPages()
        {
            return View();
        }

        /// <summary>
        /// Visits Report
        /// </summary>
        /// <param name="adsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> VisitsReport([FromBody] MobileAppDto_VisitsReport commonDetails)
        {
            try
            {
                object ds = null;
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = await objDL.Select_Visits_Duration_Date(new MLVisitMobile
                    {
                        AccountId = commonDetails.accountId,
                        Duration = commonDetails.duration,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
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
        public async Task<JsonResult> ExportNewReturnVisitsReport([FromBody] MobileAppDto_ExportNewReturnVisitsReport commonDetails)
        {
            DataSet dataSet1 = new DataSet();
            DataSet dataSet = new DataSet();
            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_TimeOnMobile(new MLTimeOnMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Day = Convert.ToDateTime(dataRow["TrackerDate"]).ToString("MMMM") + " " + Convert.ToDateTime(dataRow["TrackerDate"]).Day,
                                    Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Session"].ToString()) ? "0" : dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisit"].ToString()) ? "0" : dataRow["UniqueVisit"]),
                                    NewVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["NewVisitors"].ToString()) ? "0" : dataRow["NewVisitors"]),
                                    SingleVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["SingleVisitors"].ToString()) ? "0" : dataRow["SingleVisitors"]),
                                    RepeatVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["RepeatVisitors"].ToString()) ? "0" : dataRow["RepeatVisitors"]),
                                    ReturningVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["ReturningVisitors"].ToString()) ? "0" : dataRow["ReturningVisitors"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "MobileAnalyticNewVsReturn_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<JsonResult> ReferringTrafficExport([FromBody] MobileAppDto_ReferringTrafficExport commonDetails)
        {
            DataSet dataSet = new DataSet();
            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_Visits_Duration_Date(new MLVisitMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime
                });
            }

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Date = Convert.ToDateTime(dataRow["TrackerDate"]).Date,
                                             SessionCount = Convert.ToString(dataRow["Session"]),
                                             TotalVisitCount = Convert.ToString(dataRow["TotalVisit"]),
                                             UniqueVisitCount = Convert.ToString(dataRow["UniqueVisit"]),
                                             NewVisitorCount = Convert.ToString(dataRow["NewVisitors"]),
                                             SingleVisitorCount = Convert.ToString(dataRow["SingleVisitors"]),
                                             RepeatVisitorCount = Convert.ToString(dataRow["RepeatVisitors"]),
                                             ReturningVisitorCount = Convert.ToString(dataRow["ReturningVisitors"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsDevive_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// Time on site Report
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> TimeOnMobileReport([FromBody] MobileAppDto_TimeOnMobileReport commonDetails)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_TimeOnMobile(new MLTimeOnMobile
                    {
                        AccountId = commonDetails.accountId,
                        Duration = commonDetails.duration,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate
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
        public async Task<JsonResult> ExportTimeOnMobileReport([FromBody] MobileAppDto_ExportTimeOnMobileReport commonDetails)
        {
            DataSet dataSet1 = new DataSet();
            DataSet dataSet = new DataSet();
            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_TimeOnMobile(new MLTimeOnMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime
                });
            }
            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Day = Convert.ToDateTime(dataRow["TrackerDate"]).ToString("MMMM") + " " + Convert.ToDateTime(dataRow["TrackerDate"]).Day,
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"])),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisit"]),
                                    PageViews = Convert.ToInt32(dataRow["TotalVisit"]),
                                    NewVisitors = Convert.ToInt32(dataRow["NewVisitors"])
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "MobileAnalyticTimeOnSite_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

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
        [HttpPost]
        public async Task<IActionResult> GetFrequencyReport([FromBody] MobileAppDto_GetFrequencyReport commonDetails)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = await objDL.Select_Frequency(new MLAudienceMobile()
                    {
                        AccountId = commonDetails.AccountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,

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
        public async Task<JsonResult> MobileFrequencyExport([FromBody] MobileAppDto_MobileFrequencyExport commonDetails)
        {
            DataSet dataSet = new DataSet();

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_Frequency(new MLAudienceMobile()
                {
                    AccountId = commonDetails.AccountId,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Offset = commonDetails.OffSet,
                    FetchNext = commonDetails.FetchNext
                });
            }
            string FileName = "MobileAnalyticsFrequency_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        #region Recency
        /// <summary>
        /// Recency
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetRecency([FromBody] MobileAppDto_GetRecency commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_Recency(new MLRecencyMobile());
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
        public async Task<JsonResult> MobileRecencyExport([FromBody] MobileAppDto_MobileRecencyExport commonDetails)
        {
            DataSet dataSet;

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_Recency(new MLRecencyMobile());
            }

            DataTable dtResult = (from dataRow in dataSet.Tables[0].Select()
                                  select new
                                  {
                                      DaySince = Convert.ToString(dataRow["DaySince"]),
                                      UniqueVisitCount = Convert.ToString(dataRow["UniqueVisits"]),
                                      SessionCount = Convert.ToString(dataRow["Session"]),
                                      PageViewCount = Convert.ToString(dataRow["PageViews"]),
                                      AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                  }).CopyToDataTableExport();



            DataSet dsResult = new DataSet();
            dsResult.Tables.Add(dtResult);

            string FileName = "MobileAnalyticsRecency_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dsResult, MainPath);
            else
                Helper.SaveDataSetToExcel(dsResult, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        #endregion Recency

        /// <summary>
        /// Time Spend
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetTimeSpend([FromBody] MobileAppDto_GetTimeSpend commonDetails)
        {
            try
            {
                var ds = new object();

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = await objDL.Select_TimeSpend(new MLTimeSpendMobile
                    {
                        AccountId = commonDetails.AccountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate
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
        public async Task<JsonResult> TimeSpendExport([FromBody] MobileAppDto_TimeSpendExport commonDetails)
        {
            DataSet dataSet = new DataSet();

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_TimeSpend(new MLTimeSpendMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime
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
                                    AverageTime = String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AppTimeSpend_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            //string MainPath = "E:\\SouthAfricaBuilds\\MainBranch_UI\\EngagementUnilever\\Plumb5\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            //MainPath = "http://localhost:12347/TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetCitiesCount([FromBody] MobileAppDto_GetCitiesCount commonDetails)
        {
            try
            {
                var ds = new object();

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = await objDL.Select_MobileCityCount(new MLCitiesMobile
                    {
                        AccountId = commonDetails.AccountId,
                        Duration = commonDetails.duration,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate
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
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetCities([FromBody] MobileAppDto_GetCities commonDetails)
        {
            try
            {
                var ds = new object();

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = await objDL.Select_MobileCityDetails(new MLCitiesMobile
                    {
                        AccountId = commonDetails.AccountId,
                        // Duration = duration,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = commonDetails.start,
                        End = commonDetails.end
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
        public async Task<IActionResult> GetCityMapData([FromBody] MobileAppDto_GetCityMapData commonDetails)
        {
            try
            {
                var ds = new object();

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
                {
                    ds = await objDL.Select_CityMapDetails(new MLCitiesMobile()
                    {
                        AccountId = commonDetails.AccountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = 0,
                        End = 0,
                        Duration = commonDetails.duration
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
        public async Task<JsonResult> AppCitiesExport([FromBody] MobileAppDto_AppCitiesExport commonDetails)
        {
            DataSet dataSet;

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_MobileCityDetails(new MLCitiesMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Start = commonDetails.OffSet,
                    End = commonDetails.FetchNext
                });
            }
            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             City = Convert.ToString(dataRow["City"]),
                                             SessionCount = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitCount = Convert.ToString(dataRow["UniqueVisits"]),
                                             PageViewsCount = Convert.ToString(dataRow["PageViews"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);
            string FileName = "AppCities_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            //string MainPath = "E:\\SouthAfricaBuilds\\MainBranch_UI\\EngagementUnilever\\Plumb5\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            //MainPath = "http://localhost:12347/TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        #region MobileCountry

        [HttpPost]
        public async Task<IActionResult> GetMobileCountryReportCount([FromBody] MobileAppDto_GetMobileCountryReportCount commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_CountryMobileCount(new MLCountriesMobile
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate
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
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetMobileCountryReport([FromBody] MobileAppDto_GetMobileCountryReport commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_CountryMobile(new MLCountriesMobile
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = commonDetails.start,
                        End = commonDetails.end,
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
        public async Task<IActionResult> GetMobileCountryMapData([FromBody] MobileAppDto_GetMobileCountryMapData commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_CountryMobile(new MLCountriesMobile
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = 0,
                        End = 0,
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
        public async Task<JsonResult> CountryExport([FromBody] MobileAppDto_CountryExport commonDetails)
        {
            DataSet dataSet;

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_CountryMobile(new MLCountriesMobile
                {
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Start = commonDetails.OffSet,
                    End = commonDetails.FetchNext
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Country = String.IsNullOrEmpty(dataRow["Country"].ToString()) ? "NA" : dataRow["Country"].ToString(),
                                    Sessions = Convert.ToInt32(String.IsNullOrEmpty(dataRow["Session"].ToString()) ? "0" : dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"])
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AppCountry_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        #endregion MobileCountry

        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <returns></returns>
        //[HttpPost]
        //public IActionResult OverallData(int accountId, int duration, string fromdate, string todate)
        //{
        //    try
        //    {
        //        var ds = new object();
        //        if (duration == 1 || duration == 5)
        //        {
        //            ds = DLMobileApp.GetDLMobileApp(accountId, SQLProvider).Select_MobileOverallData(new MLVisitMobile
        //            {
        //                AccountId = accountId,
        //                Duration = duration,
        //                FromDate = fromdate,
        //                ToDate = todate
        //            });
        //        }
        //        else
        //        {
        //            MLCacheReportDetails cachereport = new MLCacheReportDetails()
        //            {
        //                Action = "MobileOverAllData",
        //                AccountId = accountId,
        //                Duration = duration
        //            };

        //            using (DLCacheReportDetails obj = new DLCacheReportDetails(Convert.ToInt32(accountId)))
        //            {
        //                ds = obj.GetCachedMobileReportDetails(cachereport);
        //            }
        //        }
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <returns></returns>
        //public IActionResult OverallPercentage(int accountId, int duration, string fromdate, string todate)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_OverallPercentage(new MLVisitMobile
        //        {
        //            AccountId = accountId,
        //            Duration = duration,
        //            FromDate = fromdate,
        //            ToDate = todate
        //        });

        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>

        [HttpPost]
        public async Task<IActionResult> CarrierReport([FromBody] MobileAppDto_CarrierReport commonDetails)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_NetworkDetails(new MLNetworkMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Start = commonDetails.startcount,
                    End = commonDetails.endcount
                });

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
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CarrierReportCount([FromBody] MobileAppDto_CarrierReportCount commonDetails)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_NetworkDetailsCount(new MLNetworkMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                });

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> CarrierExport([FromBody] MobileAppDto_CarrierExport commonDetails)
        {
            var dataSet = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_NetworkDetails(new MLNetworkMobile
            {
                AccountId = commonDetails.AccountId,
                Duration = commonDetails.Duration,
                FromDate = commonDetails.FromDateTime,
                ToDate = commonDetails.TodateTime,
                Start = commonDetails.OffSet,
                End = commonDetails.FetchNext
            });

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Date = Convert.ToDateTime(dataRow["LocalDate"]).Date,
                                             CarrierName = Convert.ToString(dataRow["Carrier"]),
                                             SessionCount = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitCount = Convert.ToString(dataRow["UniqueVisits"]),
                                             PageViewsCount = Convert.ToString(dataRow["PageViews"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsDevive_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ResolutionReportCount([FromBody] MobileAppDto_ResolutionReportCount commonDetails)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_ResolutionReportCount(new MLNetworkMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                });

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
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ResolutionReport([FromBody] MobileAppDto_ResolutionReport commonDetails)
        {
            try
            {
                var ds = new object();

                ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_ResolutionDetails(new MLNetworkMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Start = commonDetails.startcount,
                    End = commonDetails.endcount
                });

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> AppResolutionExport([FromBody] MobileAppDto_AppResolutionExport commonDetails)
        {
            var dataSet = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_ResolutionDetails(new MLNetworkMobile
            {
                AccountId = commonDetails.AccountId,
                Duration = commonDetails.Duration,
                FromDate = commonDetails.FromDateTime,
                ToDate = commonDetails.TodateTime,
                Start = commonDetails.OffSet,
                End = commonDetails.FetchNext
            });
            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             Resolution = Convert.ToString(dataRow["Resolution"]),
                                             PageViewsCount = Convert.ToString(dataRow["PageViews"]),
                                             UniqueVisitCount = Convert.ToString(dataRow["UniqueVisits"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AppResolution_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            //string MainPath = "E:\\SouthAfricaBuilds\\MainBranch_UI\\EngagementUnilever\\Plumb5\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            //MainPath = "http://localhost:12347/TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async IActionResult GeofenceReport([FromBody] MobileAppDto_GeofenceReport commonDetails)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_GeofenceDetails(new MLGeofence
        //        {
        //            AccountId = AccountId,
        //            FromDate = fromdate,
        //            ToDate = todate,
        //            Start = startcount,
        //            End = endcount
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async Task<IActionResult> BindGeofence(int AccountId)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(AccountId, SQLProvider).Select_Geofence(new MLGeofence
        //        {
        //            AccountId = AccountId
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="ScreenName"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="StartCount"></param>
        /// <param name="EndCount"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async IActionResult GetPopularPagesPropeties(int AccountId, string ScreenName, string fromdate, string todate, int StartCount, int EndCount)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(AccountId, SQLProvider).Select_PopularPageParameter(new MLMobilePopularPage
        //        {
        //            AccountId = AccountId,
        //            ScreenName = ScreenName,
        //            FromDate = fromdate,
        //            ToDate = todate,
        //            StartCount = StartCount,
        //            EndCount = EndCount
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="GeoId"></param>
        /// <param name="GeoName"></param>
        /// <param name="Lat"></param>
        /// <param name="Long"></param>
        /// <param name="Rad"></param>
        /// <param name="Locality"></param>
        /// <param name="City"></param>
        /// <param name="State"></param>
        /// <param name="Country"></param>
        /// <param name="Actions"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async IActionResult SavePushCampaign(int accountId, string GeoId, string GeoName, string Lat, string Long, string Rad, string Locality, string City, string State, string Country, string Actions)
        //{
        //    try
        //    {
        //        var arGeoId = GeoId.Split(',');
        //        var arGeoName = GeoName.Split(',');
        //        var arLat = Lat.Split(',');
        //        var arLong = Long.Split(',');
        //        var arRad = Rad.Split(',');
        //        var arLocality = Locality.Split(',');
        //        var arCity = City.Split(',');
        //        var arState = State.Split(',');
        //        var arCountry = Country.Split(',');
        //        var arActions = Actions.Split(',');
        //        dt = new DataTable();
        //        dt.Columns.Add("GeoId", typeof(int));
        //        dt.Columns.Add("GeoName", typeof(string));
        //        dt.Columns.Add("Lattitude", typeof(string));
        //        dt.Columns.Add("Longitude", typeof(string));
        //        dt.Columns.Add("Radius", typeof(string));
        //        dt.Columns.Add("EntryExit", typeof(int));
        //        dt.Columns.Add("Locality", typeof(string));
        //        dt.Columns.Add("City", typeof(string));
        //        dt.Columns.Add("State", typeof(string));
        //        dt.Columns.Add("Country", typeof(string));
        //        dt.Columns.Add("Action", typeof(string));

        //        for (var r = 0; r < arGeoName.Length; r++)
        //            dt.Rows.Add(arGeoId[r], arGeoName[r], arLat[r], arLong[r], arRad[r], 1, arLocality[r].Trim(), arCity[r].Trim(), arState[r].Trim(), arCountry[r].Trim(), arActions[r].Trim());
        //        var ds = await DLMobileApp.GetDLMobileApp(accountId, SQLProvider).SavePushCampaign(new MLGeofence
        //        {
        //            AccountId = accountId,
        //            GeoData = dt,
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="AdsId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> BindEventTrackingReport([FromBody] MobileAppDto_BindEventTrackingReport commonDetails)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_EventTrackingReport(new MLEventTrackingMobile()
                {
                    AccountId = commonDetails.accountId,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Start = 1,
                    End = 10
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> BindDeviceCount([FromBody] MobileAppDto_BindDeviceCount commonDetails)
        {
            try
            {
                var ds = new object();
                ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_GetDeviceCount(new MLGetDevicesMobile
                {
                    AccountId = commonDetails.accountId,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                });

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
        /// <param name="maintain"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///
        [HttpPost]
        public async Task<IActionResult> DeviceReport([FromBody] MobileAppDto_DeviceReport commonDetails)
        {
            try
            {
                var ds = new object();
                ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_DeviceDetails(new MLGetDevicesMobile
                {
                    AccountId = commonDetails.accountId,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    startcount = commonDetails.start,
                    endcount = commonDetails.end
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> MobileDevicesExport([FromBody] MobileAppDto_MobileDevicesExport commonDetails)
        {
            DataSet dataSet = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_DeviceDetails(new MLGetDevicesMobile
            {
                AccountId = commonDetails.AccountId,
                FromDate = commonDetails.FromDateTime,
                ToDate = commonDetails.TodateTime,
                startcount = commonDetails.OffSet,
                endcount = commonDetails.FetchNext
            });

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             DeviceName = Convert.ToString(dataRow["Manufacturer"]) + " " + Convert.ToString(dataRow["DeviceName"]),
                                             SessionCount = Convert.ToString(dataRow["Session"]),
                                             UniqueVisitCount = Convert.ToString(dataRow["UniqueVisit"]),
                                             AverageTime = Convert.ToString(dataRow["TotalTime"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsMobileDevice_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///

        [HttpPost]
        public async Task<IActionResult> OSReportCount([FromBody] MobileAppDto_OSReportCount commonDetails)
        {
            try
            {
                var ds = new object();

                ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_OSDetailsCount(new MLGetOSMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate
                });

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
        /// <param name="maintain"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///
        [HttpPost]
        public async Task<IActionResult> OSReport([FromBody] MobileAppDto_OSReport commonDetails)
        {
            try
            {
                var ds = new object();

                ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_OSDetails(new MLGetOSMobile
                {
                    AccountId = commonDetails.accountId,
                    Duration = commonDetails.duration,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    startcount = commonDetails.start,
                    endcount = commonDetails.end
                });

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> ExportOSReport([FromBody] MobileAppDto_ExportOSReport commonDetails)
        {
            DataSet dataSet1 = new DataSet();

            var dataSet = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_OSDetails(new MLGetOSMobile
            {
                AccountId = commonDetails.AccountId,
                Duration = commonDetails.Duration,
                FromDate = commonDetails.FromDateTime,
                ToDate = commonDetails.TodateTime,
                startcount = commonDetails.OffSet,
                endcount = commonDetails.FetchNext
            });

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    OSName = Convert.ToString(dataRow["OSName"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisit"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "MobileOperatingSystem_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        #region EventTracking
        [HttpPost]
        public async Task<IActionResult> SaveEventTrackSetting([FromBody] MobileAppDto_SaveEventTrackSetting commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.SaveEventTrackSetting(new MLEventTrackingMobile
                    {
                        Names = commonDetails.Names,
                        Events = commonDetails.Events,
                        EventType = commonDetails.EventType
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
        public async Task<IActionResult> UpdateEventTrackSetting([FromBody] MobileAppDto_UpdateEventTrackSetting commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.UpdateEventTrackSetting(new MLEventTrackingMobile
                    {
                        Names = commonDetails.Names,
                        Events = commonDetails.Events,
                        EventType = commonDetails.EventType,
                        Id = commonDetails.Id
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
        public async Task<IActionResult> DeleteEventTrackSetting([FromBody] MobileAppDto_DeleteEventTrackSetting commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.DeleteEventTrackSetting(new MLEventTrackingMobile
                    {
                        Id = commonDetails.Id
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
        public async Task<IActionResult> BindEventTrackingFilterValues([FromBody] MobileAppDto_BindEventTrackingFilterValues commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.BindEventTrackingFilterValues(new MLEventTrackingMobile
                    {
                        drpSearchBy = commonDetails.drpSearchBy
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
        public async Task<IActionResult> EventTrackingCount([FromBody] MobileAppDto_EventTrackingCount commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.EventTrackingCount(new MLEventTrackingMobile
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        drpSearchBy = commonDetails.drpSearchBy,
                        SearchTextValue = commonDetails.txtSearchBy
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
        public async Task<IActionResult> BindEventTrackingAllReport([FromBody] MobileAppDto_BindEventTrackingAllReport commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_EventTrackingReport(new MLEventTrackingMobile
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = commonDetails.start,
                        End = commonDetails.end,
                        drpSearchBy = commonDetails.drpSearchBy,
                        SearchTextValue = commonDetails.txtSearchBy
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
        public async Task<JsonResult> EventTrackingExport([FromBody] MobileAppDto_EventTrackingExport commonDetails)
        {
            DataSet dataSet;

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_EventTrackingReport(new MLEventTrackingMobile
                {
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Start = commonDetails.OffSet,
                    End = commonDetails.FetchNext
                });
            }

            string FileName = "AppEventTracking_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        #endregion EventTracking

        [HttpPost]
        public async Task<IActionResult> UniqueVisitsReportMaxCount([FromBody] MobileAppDto_UniqueVisitsReportMaxCount commonDetails)
        {
            try
            {
                ArrayList exportdata = new ArrayList() { commonDetails.action, commonDetails.type, commonDetails.parameter };
                HttpContext.Session.SetString("ExportData", JsonConvert.SerializeObject(exportdata));

                var ds = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_UniqueVisitsMobileMaxCount(new MLUniqueVisitsMobile()
                {
                    AccountId = commonDetails.accountId,
                    Start = commonDetails.start,
                    End = commonDetails.end,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Key = commonDetails.action,
                    Data = commonDetails.parameter
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> UniqueVisitsReport([FromBody] MobileAppDto_UniqueVisitsReport commonDetails)
        {
            try
            {
                var ds = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_UniqueVisitsMobile(new MLUniqueVisitsMobile()
                {
                    AccountId = commonDetails.accountId,
                    Start = commonDetails.start,
                    End = commonDetails.end,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Key = commonDetails.action,
                    Data = commonDetails.parameter
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> UniqueVisitsReportExport([FromBody] MobileAppDto_UniqueVisitsReportExport commonDetails)
        {
            var ds = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_UniqueVisitsMobile(new MLUniqueVisitsMobile()
            {
                AccountId = commonDetails.AccountId,
                FromDate = commonDetails.FromDateTime,
                ToDate = commonDetails.TodateTime,
                Start = commonDetails.OffSet,
                End = commonDetails.FetchNext,
                Data = "Others"
            });

            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in ds.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             Visitor = Convert.ToString(dataRow["Visitor"]),
                                             City = Convert.ToString(dataRow["Name"]),
                                             Session = Convert.ToString(dataRow["Session"]),
                                             Recency = Convert.ToDateTime(dataRow["Recency"]).Date,
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AppUniqueVisitsReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            //MainPath = "http://localhost:12347/TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///  
        //[HttpPost]
        //public async Task<IActionResult> BindVisitorsCount([FromBody] MobileAppDto_BindVisitorsCount commonDetails)
        //{
        //    try
        //    {
        //        var ds = new object();

        //        ds = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_GetVisitorsMobileCount(new MLGetVisitorsMobile
        //        {
        //            AccountId = commonDetails.accountId,
        //            Duration = commonDetails.duration,
        //            FromDate = commonDetails.fromdate,
        //            ToDate = commonDetails.todate
        //        });

        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///  
        [HttpPost]
        public async Task<IActionResult> BindVisitors([FromBody] MobileAppDto_BindVisitors commonDetails)
        {

            try
            {
                DataSet ds = null;
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_GetVisitorsMobile(new MLGetVisitorsMobile
                    {
                        AccountId = commonDetails.accountId,
                        Duration = commonDetails.duration,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = commonDetails.start,
                        End = commonDetails.end
                    });
                }

                var getdata = JsonConvert.SerializeObject(Analytics.Models.MaskEmailPhoneNumber.MaskEmailId((DataSet)ds), Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<JsonResult> MobileVisitorsExport([FromBody] MobileAppDto_MobileVisitorsExport commonDetails)
        {

            DataSet dataSet = null;
            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_GetVisitorsMobile(new MLGetVisitorsMobile
                {
                    AccountId = commonDetails.AccountId,
                    Duration = commonDetails.Duration,
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Start = commonDetails.OffSet,
                    End = commonDetails.FetchNext
                });
            }

            int RowNo = 1;
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             SLNo = RowNo++,
                                             VisitorsIPAddress = Convert.ToString(dataRow["Visitor"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"])),
                                             LastInteractionDates = Convert.ToDateTime(dataRow["Recency"]).Date,
                                             DeviceName = Convert.ToString(dataRow["Recency"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);
            string FileName = "MobileVisitors_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;
            //string MainPath = "E:\\SouthAfricaBuilds\\MainBranch_UI\\EngagementUnilever\\Plumb5\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            //MainPath = "http://localhost:12347/TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<IActionResult> SearchByFilterValues([FromBody] MobileAppDto_SearchByFilterValues commonDetails)
        {
            try
            {
                DataSet ds = null;
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_SearchByTypeFilterValues(new MLGetVisitorsMobile
                    {
                        AccountId = commonDetails.accountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Type = commonDetails.drpSearchBy,
                        SearchBy = commonDetails.txtSearchBy

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
        public async Task<IActionResult> SearchByOnclickCount([FromBody] MobileAppDto_SearchByOnclickCount commonDetails)
        {
            try
            {
                DataSet ds = null;
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_SearchByOnclickMobileCount(new MLGetVisitorsMobile
                    {
                        AccountId = commonDetails.accountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Type = commonDetails.drpSearchBy,
                        SearchBy = commonDetails.txtSearchBy,
                        Start = 0,
                        End = 0
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
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        ///  
        [HttpPost]
        public async Task<IActionResult> SearchByOnclick([FromBody] MobileAppDto_SearchByOnclick commonDetails)
        {

            try
            {
                DataSet ds = null;
                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_SearchByOnclickMobile(new MLGetVisitorsMobile
                    {
                        AccountId = commonDetails.accountId,
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Type = commonDetails.drpSearchBy,
                        SearchBy = commonDetails.txtSearchBy,
                        Start = commonDetails.start,
                        End = commonDetails.end
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
        /// Get AutoSuggestion
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="key"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async Task<IActionResult> AutoSuggest([FromBody] MobileAppDto_AutoSuggest commonDetails)
        //{
        //    try
        //    {
        //        var inBetweenLimits = "";
        //        switch (commonDetails.type)
        //        {
        //            case "Recency":
        //                inBetweenLimits = "{\"Table\": [{\"Value\": \"0 day\"},{\"Value\": \"1 day\"},{\"Value\": \"2 days\"},{\"Value\": \"3 days\"},{\"Value\": \"4 days\"},{\"Value\": \"5 days\"},{\"Value\": \"6 days\"},{\"Value\": \"7 days\"},{\"Value\": \"8-14 days\"},{\"Value\": \"15-30 days\"},{\"Value\": \"31-60 days\"},{\"Value\": \"61-120 days\"},{\"Value\": \"121-364 days\"},{\"Value\": \"More than 364 days\"}]}";
        //                break;
        //            case "Frequency":
        //                inBetweenLimits = "{\"Table\": [{\"Value\": \"1\"},{\"Value\": \"2\"},{\"Value\": \"3\"},{\"Value\": \"4\"},{\"Value\": \"5\"},{\"Value\": \"6-10\"},{\"Value\": \"11-25\"},{\"Value\": \"26-99\"},{\"Value\": \"100 or more\"}]}";
        //                break;
        //            default:
        //                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_SearchBy_AutoSuggestMobile(new MLAutosuggestMobile
        //                {
        //                    AccountId = commonDetails.accountId,
        //                    Type = commonDetails.type,
        //                    SearchText = commonDetails.q
        //                });
        //                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //                return Content(getdata.ToString(), "application/json");
        //        }
        //        //var getdata1 = JsonConvert.SerializeObject(inBetweenLimits, Formatting.Indented);
        //        return Content(inBetweenLimits, "application/json");
        //    }
        //    catch
        //    {
        //        return null;//"No results found";
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="AccountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="endcount"></param>
        /// <param name="startcount"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async Task<IActionResult> BeaconReport(int AccountId, string fromdate, string todate, int endcount, int startcount)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_BeaconDetails(new MLGeofence
        //        {
        //            AccountId = AccountId,
        //            FromDate = fromdate,
        //            ToDate = todate,
        //            Start = startcount,
        //            End = endcount
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}


        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="Beacon"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> UniqueVisitsBeacon([FromBody] MobileAppDto_UniqueVisitsBeacon commonDetails)
        {
            try
            {
                ArrayList filterdata = new ArrayList() { commonDetails.action, commonDetails.type };
                HttpContext.Session.SetString("FilterSelectedData", JsonConvert.SerializeObject(filterdata));

                var ds = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).Select_UniqueVisitsMobile(new MLUniqueVisitsMobile()
                {
                    AccountId = commonDetails.accountId,
                    Start = commonDetails.start,
                    End = commonDetails.end,
                    FromDate = commonDetails.fromdate,
                    ToDate = commonDetails.todate,
                    Key = commonDetails.action,
                    Data = commonDetails.type
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        //[HttpPost]
        //public async Task<JsonResult> UniqueVisitsBeaconExport([FromBody] MobileAppDto_UniqueVisitsBeaconExport commonDetails)
        //{

        //    string type = "", action = "";
        //    if (HttpContext.Session.GetString("FilterSelectedData") != null)
        //    {
        //        ArrayList? filterdata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("FilterSelectedData"));
        //        action = filterdata[0].ToString();
        //        type = filterdata[1].ToString();
        //    }
        //    var ds = (DataSet)await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).Select_UniqueVisitsMobile(new MLUniqueVisitsMobile()
        //    {
        //        AccountId = commonDetails.AccountId,
        //        FromDate = commonDetails.FromDateTime,
        //        ToDate = commonDetails.TodateTime,
        //        Start = commonDetails.OffSet,
        //        End = commonDetails.FetchNext,
        //        Key = action,
        //        Data = type
        //    });

        //    int RowNo = 1;
        //    DataTable resultDataTable = (from dataRow in ds.Tables[0].Select()
        //                                 select new
        //                                 {
        //                                     SLNo = RowNo++,
        //                                     Visitor = Convert.ToString(dataRow["Visitor"]),
        //                                     City = Convert.ToString(dataRow["Name"]),
        //                                     Session = Convert.ToString(dataRow["Session"]),
        //                                     Recency = Convert.ToDateTime(dataRow["Recency"]).Date,
        //                                     AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
        //                                 }).CopyToDataTableExport();

        //    DataSet resultDataSet = new DataSet();
        //    resultDataSet.Tables.Add(resultDataTable);

        //    string FileName = "AppUniqueVisitsBeacon_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
        //    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

        //    if (commonDetails.FileType.ToLower() == "csv")
        //        Helper.SaveDataSetToCSV(resultDataSet, MainPath);
        //    else
        //        Helper.SaveDataSetToExcel(resultDataSet, MainPath);

        //    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
        //    //MainPath = "http://localhost:12347/TempFiles/" + FileName;
        //    return Json(new { Status = true, MainPath });
        //}
        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="accountId"></param>
        ///// <returns></returns>

        //[HttpPost]
        //public async Task<IActionResult> BindBeaconData(int accountId)
        //{
        //    try
        //    {
        //        var ds = await DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider).BindBeaconData();
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="beaconId"></param>
        /// <param name="BeaconName"></param>
        /// <param name="UUDI"></param>
        /// <param name="Major"></param>
        /// <param name="Minor"></param>
        /// <param name="BeaconRad"></param>
        /// <param name="BeaconTrigger"></param>
        /// <param name="beaconAction"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async Task<IActionResult> SaveBeaconSettings([FromBody] MobileAppDto_SaveBeaconSettings commonDetails)
        //{
        //    try
        //    {
        //        var arBeaconId = commonDetails.beaconId.Split(',');
        //        var arBeaconName = commonDetails.BeaconName.Split(',');
        //        var arUudi = commonDetails.UUDI.Split(',');
        //        var arMajor = commonDetails.Major.Split(',');
        //        var arMinor = commonDetails.Minor.Split(',');
        //        var arBcnRad = commonDetails.BeaconRad.Split(',');
        //        var arBcnTrigger = commonDetails.BeaconTrigger.Split(',');
        //        var arBcnAction = commonDetails.beaconAction.Split(',');
        //        Beacondt = new DataTable();
        //        Beacondt.Columns.Add("BeaconId", typeof(Int32));
        //        Beacondt.Columns.Add("BeaconName", typeof(string));
        //        Beacondt.Columns.Add("BeaconUUID", typeof(string));
        //        Beacondt.Columns.Add("MajorId", typeof(Int32));
        //        Beacondt.Columns.Add("MinorId", typeof(Int32));
        //        Beacondt.Columns.Add("Radius", typeof(Int32));
        //        Beacondt.Columns.Add("EntryExist", typeof(Int32));
        //        Beacondt.Columns.Add("Action", typeof(string));

        //        for (var s = 0; s < arBcnAction.Length; s++)
        //            Beacondt.Rows.Add(arBeaconId[s] == "" ? 0 : Convert.ToInt32(arBeaconId[s]), arBeaconName[s], arUudi[s].Replace('~', ','), arMajor[s] == "" ? 0 : Convert.ToInt32(arMajor[s]), arMinor[s] == "" ? 0 : Convert.ToInt32(arMinor[s]), arBcnRad[s] == "" ? 0 : Convert.ToInt32(arBcnRad[s]), arBcnTrigger[s] == "" ? 0 : Convert.ToInt32(arBcnTrigger[s]), arBcnAction[s]);

        //        var m = await DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider).SaveBeaconSettings(new MLBeacon
        //        {
        //            AccountId = commonDetails.accountId,
        //            BeaconData = Beacondt
        //        });
        //        return Json(m);
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}


        public IActionResult EventSetting()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> EventSettingSaveOrUpdate([FromBody] MobileEventSetting mobileEventSetting)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            mobileEventSetting.UserInfoUserId = user.UserId;
            mobileEventSetting.UpdatedUserInfoUserId = user.UserId;

            if (mobileEventSetting.Id > 0)
            {
                using (var objDL = DLMobileEventSetting.GetDLMobileEventSetting(domainDetails.AdsId, SQLProvider))
                {
                    if (!await objDL.Update(mobileEventSetting))
                    {
                        mobileEventSetting.Id = -1;
                    }
                }
            }
            else
            {
                using (var objDL = DLMobileEventSetting.GetDLMobileEventSetting(domainDetails.AdsId, SQLProvider))
                {
                    mobileEventSetting.Id = await objDL.Save(mobileEventSetting);
                }
            }

            return Json(mobileEventSetting);
        }

        [HttpPost]
        public async Task<JsonResult> EventSettingDelete([FromBody] MobileAppDto_EventSettingDelete commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLMobileEventSetting.GetDLMobileEventSetting(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.Delete(commonDetails.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetEventSettingMaxCount([FromBody] MobileEventSetting mobileEventSetting)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLMobileEventSetting.GetDLMobileEventSetting(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(mobileEventSetting));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetEventSettingList([FromBody] MobileAppDto_GetEventSettingList commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLMobileEventSetting.GetDLMobileEventSetting(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetList(commonDetails.mobileEventSetting, commonDetails.OffSet, commonDetails.FetchNext));
            }
        }

        #region PopularPages

        [HttpPost]
        public async Task<IActionResult> GetPopularPagesCount([FromBody] MobileAppDto_GetPopularPagesCount commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_AllPopularPagesCount(new _Plumb5MLPopularPages
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate
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
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="channel"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetPopularPages([FromBody] MobileAppDto_GetPopularPages commonDetails)
        {
            try
            {
                DataSet ds;

                using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.accountId, SQLProvider))
                {
                    ds = (DataSet)await objDL.Select_AllPopularPages(new _Plumb5MLPopularPages
                    {
                        FromDate = commonDetails.fromdate,
                        ToDate = commonDetails.todate,
                        Start = commonDetails.start,
                        End = commonDetails.end
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
        public async Task<JsonResult> PopularPageExport([FromBody] MobileAppDto_PopularPageExport commonDetails)
        {
            DataSet dataSet;

            using (var objDL = DLMobileApp.GetDLMobileApp(commonDetails.AccountId, SQLProvider))
            {
                dataSet = (DataSet)await objDL.Select_AllPopularPages(new _Plumb5MLPopularPages
                {
                    FromDate = commonDetails.FromDateTime,
                    ToDate = commonDetails.TodateTime,
                    Start = commonDetails.OffSet,
                    End = commonDetails.FetchNext
                });
            }

            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    PageName = String.IsNullOrEmpty(dataRow["PageName"].ToString()) ? "NA" : dataRow["PageName"].ToString(),
                                    UniqueVisitors = Convert.ToInt32(String.IsNullOrEmpty(dataRow["UniqueVisits"].ToString()) ? "0" : dataRow["UniqueVisits"]),
                                    PageView = Convert.ToInt32(String.IsNullOrEmpty(dataRow["PageViews"].ToString()) ? "0" : dataRow["PageViews"]),
                                    AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? 0 : dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(objDataTable);

            string FileName = "AppPopularPage_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;


            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        #endregion PopularPages

        //public async Task<IActionResult> UniqueVisitsCachedReport(int accountId, string type, string parameter, string fromdate, string todate)
        //{
        //    try
        //    {
        //        var ds = (DataSet)_Plumb5DLUniqueVisitors.(accountId).GetCachedUniqueVisits(new _Plumb5MLUniqueVisits()
        //        {
        //            AccountId = accountId,
        //            FromDate = fromdate,
        //            ToDate = todate,
        //            Key = type,
        //            Data = parameter
        //        });
        //        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return Content(getdata.ToString(), "application/json");
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
    }
}
