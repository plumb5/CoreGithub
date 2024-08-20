using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Areas.Analytics.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class TrafficController : BaseController
    {
        public TrafficController(IConfiguration _configuration) : base(_configuration)
        { }

        //Analytics/Traffic/
        public string CurrentUTCDateTimeForOutputCache = "";
        public async Task<ActionResult> AllSources()
        {
            return View();
        }
        public async Task<ActionResult> Referral()
        {
            return View();
        }
        public async Task<ActionResult> AllReferral()
        {
            return View();
        }
        public async Task<ActionResult> OrganicSearch()
        {
            return View();
        }

        public async Task<ActionResult> SourcePages()
        {
            return View();
        }
        public async Task<ActionResult> SearchKeys()
        {
            return View();
        }
        public async Task<ActionResult> AllOrganicSearch()
        {
            return View();
        }
        public async Task<ActionResult> PaidCampaigns()
        {
            return View();
        }
        public async Task<ActionResult> Adwords()
        {
            return View();
        }
        public async Task<ActionResult> Adsense()
        {
            return View();
        }
        public async Task<ActionResult> SocialSources()
        {
            return View();
        }
        public async Task<ActionResult> AllSocialSources()
        {
            return View();
        }
        public async Task<ActionResult> AttributionModel()
        {
            return View();
        }
        public async Task<ActionResult> VisitorsFlow()
        {
            return View();
        }
        public async Task<ActionResult> AttributionModelSetting()
        {
            return View();
        }
        public async Task<ActionResult> AttributionModelView()
        {
            return View();
        }
        public async Task<ActionResult> PaidCampaignFilters()
        {
            return View();
        }
        public async Task<ActionResult> EmailSources()
        {
            return View();
        }
        public async Task<ActionResult> SmsSources()
        {
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <param name="domain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> AllSourcesReport([FromBody] Traffic_AllSourcesReportDto traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_AllSources(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate
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
        public async Task<JsonResult> AllSourcesExport([FromBody] Traffic_AllSourcesExportDto traficDetails)
        {
            DataSet dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_AllSources(new _Plumb5MLAllSources
            {
                AccountId = traficDetails.AccountId,
                Duration = traficDetails.Duration,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime
            });

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(traficDetails.AccountId, SQLProvider);

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Day = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Date"])).Value.ToString("dd/MM/yyyy"),
                                             DirectTraffic = Convert.ToString(dataRow["Direct"]),
                                             SearchTraffic = Convert.ToString(dataRow["Search"]),
                                             ReferTraffic = Convert.ToString(dataRow["Refer"]),
                                             SocialTraffic = Convert.ToString(dataRow["Social"]),
                                             EmailTraffic = Convert.ToString(dataRow["Email"]),
                                             SMSTraffic = Convert.ToString(dataRow["Sms"]),
                                             PaidTraffic = Convert.ToString(dataRow["Paid"]),
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsNetwork_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// Referral
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> ReferringTrafficReport([FromBody] Traffic_ReferringTrafficReport traficDetails)
        {
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion

                var ReferTrafficData = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Refer",
                    Start = traficDetails.start,
                    End = traficDetails.end
                });
                var getdata = JsonConvert.SerializeObject(new { ReferTrafficData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> ReferringTrafficReportCount([FromBody] Traffic_ReferringTrafficReportCount traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_SocialCount(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Refer",
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
        public async Task<JsonResult> ReferringTrafficExport([FromBody] Traffic_ReferringTrafficExport traficDetails)
        {
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
            {
                AccountId = traficDetails.AccountId,
                Duration = traficDetails.Duration,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Key = "Refer",
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });

            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             Sources = Convert.ToString(dataRow["Source"]),
                                             UniqueVisitors = Convert.ToString(dataRow["UniqueVisits"]),
                                             Sessions = Convert.ToString(dataRow["Session"]),
                                             AvgTimeOnSite = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                         }).CopyToDataTableExport();

            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);

            string FileName = "AnalyticsDevive_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        /// <summary>
        /// Search Traffic Max Count
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SearchTrafficReportCount([FromBody] Traffic_SearchTrafficReportCount traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_SocialCount(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Search"
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
        /// Search Traffic
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SearchTrafficReport([FromBody] Traffic_SearchTrafficReport traficDetails)
        {
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                var SearchTrafficData = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Search",
                    Start = traficDetails.start,
                    End = traficDetails.end
                });
                var getdata = JsonConvert.SerializeObject(new { SearchTrafficData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> ExportSearchTrafficReport([FromBody] Traffic_ExportSearchTrafficReport traficDetails)
        {
            DataSet dataSet1 = new DataSet();
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
            {
                AccountId = traficDetails.AccountId,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Key = "Search",
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });


            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Source = Convert.ToString(dataRow["Source"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisits"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    AvgTimeOnSite = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "AnalyticsOrganicSearch_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }


        /// <summary>
        /// Source Pages
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SearchSourcePages([FromBody] Traffic_SearchSourcePages traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Source_Pages(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = traficDetails.Source,
                    Start = traficDetails.start,
                    End = traficDetails.end,
                    Type = traficDetails.Type

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
        /// Search Key
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SearchKeyReport([FromBody] Traffic_SearchKeyReport traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Search_Keys(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = traficDetails.Source,
                    Start = traficDetails.start,
                    End = traficDetails.end,
                    Page = traficDetails.page
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> PaidCampaignsReportCount([FromBody] Traffic_PaidCampaignsReportCount traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).GetPaidCampaignCount(new _Plumb5MLPaidCampaigns
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = traficDetails.Action,
                    UTMParameter = traficDetails.QuickFilterBy
                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetDropDownReady([FromBody] Traffic_GetDropDownReady traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).GetDropDownReady();
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        /// <summary>
        /// Paid Campaigns
        /// </summary>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> PaidCampaignsReport([FromBody] Traffic_PaidCampaignsReport traficDetails)
        {
            try
            {

                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_PaidCampaigns(new _Plumb5MLPaidCampaigns
                {
                    Key = traficDetails.Action,
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Start = traficDetails.start,
                    End = traficDetails.end,
                    UTMParameter = traficDetails.QuickFilterBy
                });
                ds = new CommonFunction().Decode((DataSet)ds);
                var getdata = JsonConvert.SerializeObject(new { ds, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> UtmTagsExportReport([FromBody] Traffic_UtmTagsExportReport traficDetails)
        {
            DataSet dataSet1 = new DataSet();
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_PaidCampaigns(new _Plumb5MLPaidCampaigns
            {
                Key = "GetUTMTagsDetails",
                AccountId = traficDetails.AccountId,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(traficDetails.AccountId, SQLProvider);
            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    LandingPages = !String.IsNullOrEmpty(Convert.ToString(dataRow["PageName"])) ? Convert.ToString(dataRow["PageName"]).Replace("&amp;", "&") : "NA",
                                    PageViews = Convert.ToInt32(dataRow["PageViews"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisitors"]),
                                    Source = !String.IsNullOrEmpty(Convert.ToString(dataRow["UtmSource"])) ? Convert.ToString(dataRow["UtmSource"]).Replace("&amp;", "&") : "NA",
                                    Medium = !String.IsNullOrEmpty(Convert.ToString(dataRow["UtmMedium"])) ? Convert.ToString(dataRow["UtmMedium"]).Replace("&amp;", "&") : "NA",
                                    Campaign = !String.IsNullOrEmpty(Convert.ToString(dataRow["UtmCampaign"])) ? Convert.ToString(dataRow["UtmCampaign"]).Replace("&amp;", "&") : "NA",
                                    Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Recency"])).ToString()
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "UTMTag_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<ActionResult> AdWordsExportReport([FromBody] Traffic_AdWordsExportReport traficDetails)
        {
            DataSet dataSet1 = new DataSet();
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_PaidCampaigns(new _Plumb5MLPaidCampaigns
            {
                Key = "GetAdwordsDetails",
                AccountId = traficDetails.AccountId,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(traficDetails.AccountId, SQLProvider);
            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    PageName = Convert.ToString(dataRow["PageName"]),
                                    PageViews = Convert.ToInt32(dataRow["PageViews"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisitors"]),
                                    Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Recency"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "Adwords_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<ActionResult> AdSenseExportReport([FromBody] Traffic_AdSenseExportReport traficDetails)
        {
            DataSet dataSet1 = new DataSet();
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_PaidCampaigns(new _Plumb5MLPaidCampaigns
            {
                Key = "GetAdwordsDetails",
                AccountId = traficDetails.AccountId,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(traficDetails.AccountId, SQLProvider);
            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    PageName = Convert.ToString(dataRow["PageName"]),
                                    PageViews = Convert.ToInt32(dataRow["PageViews"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisitors"]),
                                    Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Recency"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "Adsense_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SocialTrafficReportCount([FromBody] Traffic_SocialTrafficReportCount traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_SocialCount(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Social"
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
        /// <param name="mode"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> SocialSourceReport([FromBody] Traffic_SocialSourceReport traficDetails)
        {
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                var SocialSourceData = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = "Social",
                    Start = traficDetails.start,
                    End = traficDetails.end
                });
                var getdata = JsonConvert.SerializeObject(new { SocialSourceData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SocialSourceReportExport([FromBody] Traffic_SocialSourceReportExport traficDetails)
        {
            DataSet dataSet1 = new DataSet();
            var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_Referrer_Search_Social(new _Plumb5MLAllSources
            {
                AccountId = traficDetails.AccountId,
                FromDate = traficDetails.FromDateTime,
                ToDate = traficDetails.TodateTime,
                Key = "Social",
                Start = traficDetails.OffSet,
                End = traficDetails.FetchNext
            });


            int RowNo = 1;
            var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                select new
                                {
                                    SLNo = RowNo++,
                                    Source = Convert.ToString(dataRow["Source"]),
                                    UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisits"]),
                                    Sessions = Convert.ToInt32(dataRow["Session"]),
                                    AvgTimeOnSite = Helper.AverageTime(Convert.ToDecimal(dataRow["AvgTime"]))
                                }).CopyToDataTableExport();

            dataSet1.Tables.Add(objDataTable);

            string FileName = "SocialTraffic_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (traficDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet1, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet1, MainPath);

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
        /// <param name="compare"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> OverallPercentage([FromBody] Traffic_OverallPercentage traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_OverallPercentage(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    Compare = traficDetails.compare,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate
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
        /// <param name="modelName"></param>
        /// <param name="pageName"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> SaveAttributionSetting([FromBody] Traffic_SaveAttributionSetting traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Insert_AttributionSetting(new _Plumb5MLAttributionModel
                {
                    AccountId = traficDetails.accountId,
                    ModelName = traficDetails.modelName,
                    PageName = traficDetails.pageName
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
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AttributionReportCount([FromBody] Traffic_AttributionReportCount traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).AttributionReportCount(new _Plumb5MLAttributionModel
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate
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
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AttributionReport([FromBody] Traffic_AttributionReport traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_Attribution(new _Plumb5MLAttributionModel
                {
                    AccountId = traficDetails.accountId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate
                }, traficDetails.start, traficDetails.end);

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
        /// <param name="attributionId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AttributionDelete([FromBody] Traffic_AttributionDelete traficDetails)
        {
            try
            {
                var res = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Delete_Attribution(new _Plumb5MLAttributionModel
                {
                    AccountId = traficDetails.accountId,
                    AttributionId = traficDetails.attributionId,
                    Key = "Delete"
                });
                return Json(new { res });
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
        /// <param name="maintain"></param>
        /// <param name="modelId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> BindModelViewReport([FromBody] Traffic_BindModelViewReport traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_AttributionModelView(new _Plumb5MLAttributionModel
                {
                    AccountId = traficDetails.accountId,
                    AttributionId = traficDetails.modelId,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = traficDetails.key
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
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="modelId"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> BindVisitorsFlow([FromBody] Traffic_BindVisitorsFlow traficDetails)
        {
            Tuple<List<MLUserJourney>, List<MLUserJourney>, List<MLUserJourney>> mLUserJourneys = null;
            _Plumb5MVisitorsFlow _visitorsFlow = new _Plumb5MVisitorsFlow()
            {
                AccountId = traficDetails.accountId,
                Interaction = 1,
                FromDate = traficDetails.fromdate,
                ToDate = traficDetails.todate,
                Domain = "NA",
                Action = traficDetails.key,
                ListData = new DataTable(),
                ListDataNew = new DataTable(),
                Duration = traficDetails.duration
            };

            using (var objInteraction = new VisitorFlowInteraction(traficDetails.accountId, SQLProvider))
            {
                mLUserJourneys = await objInteraction.GetVistorFlows(_visitorsFlow);
            }

            return Json(mLUserJourneys);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="maintain"></param>
        /// <param name="modelId"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> BindUserVisitorsFlow([FromBody] Traffic_BindUserVisitorsFlow traficDetails)
        {
            try
            {
                var AccountInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                int accountId = AccountInfo.AdsId;
                string Domain = AccountInfo.DomainName.Replace("www.", "");

                var dt = new DataTable();
                dt.Columns.Add("PageUrl", typeof(string));

                if (traficDetails.key == "Page")
                {
                    string[] arPages = traficDetails.Pages.Split(',');
                    for (var m = 0; m < arPages.Length; m++)
                        dt.Rows.Add(arPages[m].Contains(Domain) == true ? arPages[m] : Domain + arPages[m]);
                }
                var ds = await DLTraffic.GetDLTraffic(accountId, SQLProvider).Select_UserVisitorsFlow(new _Plumb5UserVisitorsFlow
                {
                    AccountId = accountId,
                    Interaction = traficDetails.Interaction,
                    Action = traficDetails.key,
                    Domain = Domain,
                    MachineId = traficDetails.MachineId,
                    ListData = dt
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
        /// AllSourcesReport Compare
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <param name="domain"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> AllSourcesReportCompare([FromBody] Traffic_AllSourcesReportCompare traficDetails)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_AllSources_Compare(new _Plumb5MLAllSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
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
        /// EmailSmsReport
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="duration"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="compare"></param>
        /// <param name="compareOption"></param>
        /// <param name="maintain"></param>
        /// <param name="domain"></param>
        /// <returns></returns>
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> EmailSmsReport([FromBody] Traffic_EmailSmsReport traficDetails)
        {
            try
            {
                #region OutputCache Current TodateTime
                CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                #endregion
                var EmailSmsData = await DLTraffic.GetDLTraffic(traficDetails.accountId, SQLProvider).Select_EmailSmsSources(new _Plumb5MLEmailSmsSources
                {
                    AccountId = traficDetails.accountId,
                    Duration = traficDetails.duration,
                    FromDate = traficDetails.fromdate,
                    ToDate = traficDetails.todate,
                    Key = traficDetails.key
                });

                HttpContext.Session.SetString("EmailSmsSource", traficDetails.key);

                var getdata = JsonConvert.SerializeObject(new { EmailSmsData, CurrentUTCDateTimeForOutputCache }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> ExportEmailSmsReport([FromBody] Traffic_ExportEmailSmsReport traficDetails)
        {
            string FileName = String.Empty, MainPath = String.Empty;
            DataSet dataSet1 = new DataSet();
            if (!String.IsNullOrEmpty(HttpContext.Session.GetString("EmailSmsSource")))
            {
                var dataSet = (DataSet)await DLTraffic.GetDLTraffic(traficDetails.AccountId, SQLProvider).Select_EmailSmsSources(new _Plumb5MLEmailSmsSources
                {
                    AccountId = traficDetails.AccountId,
                    Duration = traficDetails.Duration,
                    FromDate = traficDetails.FromDateTime,
                    ToDate = traficDetails.TodateTime,
                    Key = HttpContext.Session.GetString("EmailSmsSource")
                });

                int RowNo = 1;

                var objDataTable = (from dataRow in dataSet.Tables[0].Select()
                                    select new
                                    {
                                        SLNo = RowNo++,
                                        Day = Convert.ToString(dataRow["Date"]),
                                        Sessions = Convert.ToInt32(dataRow["Session"]),
                                        UniqueVisitors = Convert.ToInt32(dataRow["UniqueVisit"]),
                                        PageViews = Convert.ToInt32(dataRow["TotalVisit"]),
                                        AverageTime = Helper.AverageTime(Convert.ToDecimal(dataRow["TotalTime"]))
                                    }).CopyToDataTableExport();

                dataSet1.Tables.Add(objDataTable);

                if (HttpContext.Session.GetString("EmailSmsSource").ToString().ToLower().Contains("email"))
                    FileName = "AnalyticsEmailSource_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;
                else if (HttpContext.Session.GetString("EmailSmsSource").ToString().ToLower().Contains("sms"))
                    FileName = "AnalyticsSmsSource_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + traficDetails.FileType;

                MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (traficDetails.FileType.ToLower() == "csv")
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
    }
}
