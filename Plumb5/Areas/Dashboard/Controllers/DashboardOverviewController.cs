using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Areas.Dashboard.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class DashboardOverviewController : BaseController
    {
        public DashboardOverviewController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> Index()
        {
            return View("DashboardOverview");
        }
        [HttpPost]
        public async Task<JsonResult> GetJsonContent([FromBody] DashboardOverview_GetJsonContentDto objDto)
        {

            using (var objDL = DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider))
            {
                var JsonContent =await objDL.GetJsonContent(objDto.UserId);
                var getdata = JsonConvert.SerializeObject(JsonContent, Formatting.Indented);
                return Json(getdata);
            }
        }
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDashboardWidgets([FromBody] DashboardOverview_SaveOrUpdateDashboardWidgetsDto objDto)
        {
            int dashboardid = 0;
            using (var objDL =DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider))
            {
                dashboardid =await objDL.SaveOrUpdateDashboardWidgets(objDto.accountId, objDto.UserId, objDto.jsonString);
            }
            return Json(new { dashboardid });
        }

        #region Dashboard Web Analytics Widgets
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> VisitsReport([FromBody] DashboardOverview_VisitsReportDto objDto)
        {
            try
            {
                var ds = new object();
                ds =await DLDashboard.GetDLDashboard(objDto.accountId, SQLProvider).Select_Visits_Duration_Date(new _Plumb5MLVisits
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> GetFrequencyReport([FromBody] DashboardOverview_GetFrequencyReportDto objDto)
        {
            try
            {
                var ds = new object();

                ds = await DLAudience.GetDLAudience(objDto.AccountId,SQLProvider).Select_Frequency(new _Plumb5MLFrequency()
                {
                    AccountId = objDto.AccountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> CountryReport([FromBody] DashboardOverview_CountryReportDto objDto)
        {
            try
            {

                var CountryData =await DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider).Select_Country(new _Plumb5MLCountry()
                {
                    AccountId = objDto.accountId,
                    Start = objDto.start,
                    End = objDto.end,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
                    Duration = objDto.duration
                });

                var getdata = JsonConvert.SerializeObject(new { CountryData }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> CityReport([FromBody] DashboardOverview_CityReportDto objDto)
        {
            try
            {
                var CityData =await DLAudience.GetDLAudience(objDto.accountId,SQLProvider).Select_Location_CityDetails(new _Plumb5MLCity()
                {
                    AccountId = objDto.accountId,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
                    Start = objDto.start,
                    End = objDto.end,
                    Duration = objDto.duration
                });
                var getdata = JsonConvert.SerializeObject(new { CityData }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");


            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetRecency([FromBody] DashboardOverview_GetRecencyDto objDto)
        {
            try
            {
                var ds =await DLAudience.GetDLAudience(objDto.AccountId,SQLProvider).Select_Recency(new _Plumb5MLRecency
                {
                    AccountId = objDto.AccountId,
                    Start = objDto.OffSet,
                    End = objDto.FetchNext
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
        public async Task<ActionResult> GetTimeSpend([FromBody] DashboardOverview_GetTimeSpendDto objDto)
        {
            try
            {
                var ds = new object();
                ds =await DLAudience.GetDLAudience(objDto.AccountId,SQLProvider).Select_TimeSpend(new _Plumb5MLTimeSpend
                {
                    AccountId = objDto.AccountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> GetPageDepth([FromBody] DashboardOverview_GetPageDepthDto objDto)
        {
            try
            {
                var ds = new object();
                ds =await DLAudience.GetDLAudience(objDto.AccountId,SQLProvider).Select_PageDepth(new _Plumb5MLPageDepth
                {
                    AccountId = objDto.AccountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> NewRepeatReport([FromBody] DashboardOverview_NewRepeatReportDto objDto)
        {
            try
            {
                var ds = new object();
                ds = await DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider).Select_NewVsRepeat(new _Plumb5MLNewRepeat
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> VisitorsTimeTrends([FromBody] DashboardOverview_VisitorsTimeTrendsDto objDto)
        {
            try
            {
                var ds = new object();
                ds = await DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider).Select_Visitors_TimeTrends(new _Plumb5MLTimeTrends
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
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
        public async Task<ActionResult> AllSourcesReport([FromBody] DashboardOverview_AllSourcesReportDto objDto)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(objDto.accountId,SQLProvider).Select_AllSources(new _Plumb5MLAllSources
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> TimeOnSiteReport([FromBody] DashboardOverview_TimeOnSiteReportDto objDto)
        {
            try
            {
                var ds = new object();

                ds = await DLDashboard.GetDLDashboard(objDto.accountId,SQLProvider).Select_TimeOnSite(new _Plumb5MLTimeOnSite
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> EmailSmsReport([FromBody] DashboardOverview_EmailSmsReportDto objDto)
        {
            try
            {
                var ds = await DLTraffic.GetDLTraffic(objDto.accountId,SQLProvider).Select_EmailSmsSources(new _Plumb5MLEmailSmsSources
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
                    Key = objDto.key
                });
                HttpContext.Session.SetString("EmailSmsSource", JsonConvert.SerializeObject(objDto.key));
               
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
        public async Task<ActionResult> GetPopularPages([FromBody] DashboardOverview_GetPopularPagesDto objDto)
        {
            try
            {
                //#region OutputCache Current TodateTime
                //if (duration == 1)
                //    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                //#endregion
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(objDto.accountId, SQLProvider).Result;
                var PopularPageData = await DLContent.GetDLContent(ConnectionStr, SQLProvider).Select_AllPopularPages(new _Plumb5MLPopularPages
                {
                    AccountId = objDto.accountId,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
                    Start = objDto.start,
                    End = objDto.end,
                    Duration = objDto.duration
                });
                PopularPageData = new CommonFunction().Decode((DataSet)PopularPageData);
                var getdata = JsonConvert.SerializeObject(new { PopularPageData }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetTopEntryExitPages([FromBody] DashboardOverview_GetTopEntryExitPagesDto objDto)
        {
            try
            {
                //#region OutputCache Current TodateTime
                //if (duration == 1)
                //    CurrentUTCDateTimeForOutputCache = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss");
                //#endregion
                string ConnectionStr = Plumb5.Models.AccountDetails.GetAccountConnection(objDto.accountId, SQLProvider).Result;
                var TopEntryExitPageDate = await DLContent.GetDLContent(ConnectionStr, SQLProvider).Select_EntryandExitPage(new _Plumb5MLEntryandExit
                {
                    AccountId = objDto.accountId,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
                    Start = objDto.start,
                    End =   objDto.end,
                    Key = objDto.key,
                    Duration = objDto.duration
                });
                HttpContext.Session.SetString("TopEntryExitPages", JsonConvert.SerializeObject(objDto.key));
               
                TopEntryExitPageDate = new CommonFunction().Decode((DataSet)TopEntryExitPageDate);
                var getdata = JsonConvert.SerializeObject(new { TopEntryExitPageDate }, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        #endregion

        #region Dashboard Form Widgets
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetTotalFormSubmissions([FromBody] DashboardOverview_GetTotalFormSubmissionsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AccountId, SQLProvider))
            {
                return Json(await objDL.GetTotalFormSubmissions(FromDateTime, ToDateTime));
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetAggregateFormsData([FromBody] DashboardOverview_GetAggregateFormsDataDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AccountId, SQLProvider))
            {
                return Json(await objDL.GetAggregateFormsData(FromDateTime, ToDateTime));
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetPlatformDistribution([FromBody] DashboardOverview_GetPlatformDistributionDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL =  DLFormDashboard.GetDLFormDashboard(objDto.AccountId,SQLProvider))
            {
                return Json(objDL.GetPlatformDistribution(FromDateTime, ToDateTime));
            }
        }
        #endregion

        //#region Dashboard WebPush Widgets
        //[OutputCache]
        //public async Task<JsonResult> GetCampaignDetails(int objDto.accountId, string fromDateTime, string toDateTime)
        //{
        //    DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

        //    using (var webPushDashboard =  DLWebPushDashboard.get(objDto.accountId, SQLProvider))
        //    {
        //        return Json(webPushDashboard.GetCampaignDetails(FromDateTime, ToDateTime));
        //    }
        //}
        //[OutputCache]
        //public async Task<JsonResult> GetSubcribersDetails(int objDto.accountId, string fromDateTime, string toDateTime)
        //{
        //    DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

        //    using (var webPushDashboard =  DLWebPushDashboard(objDto.accountId, SQLProvider))
        //    {
        //        return Json(webPushDashboard.GetSubcribersDetails(FromDateTime, ToDateTime));
        //    }
        //}
        //#endregion

        #region Dashboard Mail Widgets
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetCampaignEffectiveness([FromBody] DashboardOverview_GetCampaignEffectivenessDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MailDashboardCampaignEffectiveness> campaignEffectiveness = new List<MailDashboardCampaignEffectiveness>();
            using (var objDL =  DLDashboardMail.GetDLDashboardMail(objDto.AdsId,SQLProvider))
            {
                campaignEffectiveness =await objDL.GetMailDashboardCampaignEffectiveness(FromDateTime, ToDateTime);
            }
            return Json(campaignEffectiveness);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetEngagementDetails([FromBody] DashboardOverview_GetEngagementDetailsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MailDashboadEngagement mailEngagement = new MailDashboadEngagement();
            using (var objDL = DLDashboardMail.GetDLDashboardMail(objDto.AdsId,SQLProvider))
            {
                mailEngagement =await objDL.GetMailDashboadEngagement(FromDateTime, ToDateTime);
            }
            return Json(mailEngagement);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetMailPerformanceOverTime([FromBody] DashboardOverview_GetMailPerformanceOverTimeDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MailPerformanceOverTime> mailPerformanceDetails = new List<MailPerformanceOverTime>();
            using (var objDL =  DLDashboardMail.GetDLDashboardMail(objDto.AdsId,SQLProvider))
            {
                mailPerformanceDetails = await objDL.GetMailPerformanceOverTime(FromDateTime, ToDateTime);
            }
            return Json(mailPerformanceDetails);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetDeliveryDetails([FromBody] DashboardOverview_GetDeliveryDetailsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MailDashboardDelivery mailDelivery = new MailDashboardDelivery();
            using (var objDL =  DLDashboardMail.GetDLDashboardMail(objDto.AdsId,SQLProvider))
            {
                mailDelivery =await objDL.GetMailDashboardDelivery(FromDateTime, ToDateTime);
            }
            return Json(mailDelivery);
        }
        #endregion

        #region Dashboard SMS Widgets
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetCampaignEffectivenessData([FromBody] DashboardOverview_GetCampaignEffectivenessDataDto objDto)
        {
            List<MLSmsDashboardCampaignEffectiveness> dashboardDetails = null;
            using (var objDL =  DLSmsDashboardReport.GetDLSmsDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.GetCampaignEffectivenessData(objDto.fromdate, objDto.todate);
            }
            return Json(dashboardDetails);

        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetSmsDashboardEngagementData([FromBody] DashboardOverview_GetSmsDashboardEngagementDataDto objDto)
        {
            List<MLSmsDashboardEngagement> dashboardDetails = null;
            using (var objDL =  DLSmsDashboardReport.GetDLSmsDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.GetSmsDashboardEngagementData(objDto.fromdate, objDto.todate);
            }

            return Json(dashboardDetails);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetSmsDashboardDeliveryData([FromBody] DashboardOverview_GetSmsDashboardDeliveryDataDto objDto)
        {
            List<MLSmsDashboardDelivery> dashboardDetails = null;
            using (var objDL =  DLSmsDashboardReport.GetDLSmsDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.GetSmsDashboardDeliveryData(objDto.fromdate, objDto.todate);
            }

            return Json(dashboardDetails);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetSmsPerformanceOverTimeData([FromBody] DashboardOverview_GetSmsPerformanceOverTimeDataDto objDto)
        {
            List<MLSmsDashboardSmsPerformanceOverTime> dashboardDetails = null;
            using (var objDL = DLSmsDashboardReport.GetDLSmsDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.GetSmsPerformanceOverTimeData(objDto.fromdate, objDto.todate);
            }

            return Json(dashboardDetails);
        }

        #endregion

        #region Dashboard Mobile Analytics Widgets
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> MobileVisitsReport([FromBody] DashboardOverview_MobileVisitsReportDto objDto)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(objDto.accountId,SQLProvider).Select_Visits_Duration_Date(new MLVisitMobile
                {   AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,
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
        public async Task<ActionResult> TimeOnMobileReport([FromBody] DashboardOverview_TimeOnMobileReportDto objDto)
        {
            try
            {
                var ds = new object();

                ds = await DLMobileApp.GetDLMobileApp(objDto.accountId,SQLProvider).Select_TimeOnMobile(new MLTimeOnMobile
                {
                    AccountId = objDto.accountId,
                    Duration = objDto.duration,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate
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
        public async Task<ActionResult> GetMobileFrequencyReport([FromBody] DashboardOverview_GetMobileFrequencyReportDto objDto)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(objDto.AccountId, SQLProvider).Select_Frequency(new MLAudienceMobile()
                {
                    AccountId = objDto.AccountId,
                    FromDate = objDto.fromdate,
                    ToDate = objDto.todate,

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
        public async Task<ActionResult> GetMobileRecency([FromBody] DashboardOverview_GetMobileRecencyDto objDto)
        {
            try
            {
                var ds = await DLMobileApp.GetDLMobileApp(objDto.AccountId, SQLProvider).Select_Recency(new MLRecencyMobile
                {
                    AccountId = objDto.AccountId

                });
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        #endregion

        #region Dashboard MobilePush Widgets
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetMobilePushCampaignDetails([FromBody] DashboardOverview_GetMobilePushCampaignDetailsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var mobilePushDashboard =  DLMobilePushDashboard.GetDLMobilePushDashboard(objDto.AccountId, SQLProvider))
            {
                return Json(await mobilePushDashboard.GetCampaignDetails(FromDateTime, ToDateTime));
            }
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetMobileSubcribersDetails([FromBody] DashboardOverview_GetMobileSubcribersDetailsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var mobilePushDashboard =  DLMobilePushDashboard.GetDLMobilePushDashboard(objDto.AccountId, SQLProvider))
            {
                return Json( await mobilePushDashboard.GetSubcribersDetails(FromDateTime, ToDateTime));
            }
        }

        #endregion

        #region Live Chat Widgets
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetChatReport([FromBody] DashboardOverview_GetChatReportDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLChatDashBoard> dashboardDetails = null;
            using (var objDL =  DLChatDashBoard.GetDLCartDetails(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.GetChatReport(objDto.ChatId, objDto.Duration, FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> Conversations([FromBody] DashboardOverview_ConversationsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            MLChatDashBoard dashboardDetails = null;
            using (var objDL =  DLChatDashBoard.GetDLCartDetails(objDto.accountId,SQLProvider))
            {
                dashboardDetails =await objDL.Conversations(FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        #endregion

        #region LMS Widggets
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetTopSources([FromBody] DashboardOverview_GetTopSourcesDto objDto)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (objDto.UserId > 0)
            {
                userInfoUserId = objDto.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo =  DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups =await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy =  DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(userInfoUserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            
            using (var objDL = DLLmsDashboard.GetDLLmsDashboard(objDto.AdsId, SQLProvider))
            {
                data = await objDL.TopSources(userId, userGroups, FromDate, ToDate);               
            }
            var getdata = JsonConvert.SerializeObject(data);
            return Content(getdata.ToString(), "application/json");

        }

        public class _Plumb5MLSource
        {
            public string userId { get; set; }
            public List<int> userGroups { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }

        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetTopStages([FromBody] DashboardOverview_GetTopStagesDto objDto)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (objDto.UserId > 0)
            {
                userInfoUserId = objDto.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo =  DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups =await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy =  DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(userInfoUserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL =  DLLmsDashboard.GetDLLmsDashboard(objDto.AdsId,SQLProvider))
            {
                data =await objDL.TopStages(userId, userGroups, FromDate, ToDate);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [OutputCache]
        [HttpPost]
        public async Task<ActionResult> GetSummary([FromBody] DashboardOverview_GetSummaryDto objDto)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (objDto.UserId > 0)
            {
                userInfoUserId = objDto.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo =  DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups =await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy =  DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(userInfoUserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL =  DLLmsDashboard.GetDLLmsDashboard(objDto.AdsId,SQLProvider))
            {
                data =await objDL.GetSummary(userId, userGroups, FromDate, ToDate);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetLeadSummary([FromBody] DashboardOverview_GetLeadSummaryDto objDto)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (objDto.UserId > 0)
            {
                userInfoUserId = objDto.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups =await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy =  DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(userInfoUserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL =  DLLmsDashboard.GetDLLmsDashboard(objDto.AdsId,SQLProvider))
            {
                data =await objDL.GetSummary(userId, userGroups, FromDate, ToDate);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        #endregion
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDashboardMailAlert([FromBody] DashboardOverview_SaveOrUpdateDashboardMailAlertDto objDto)
        {
            int dashboardid = 0;
            using (var objDL =  DLDashboardMailAlert.GetDLDashboardMailAlert(objDto.accountId,SQLProvider))
            {
                dashboardid =await objDL.Save(objDto.mailAlert);
            }
            return Json(new { dashboardid });
        }
        [HttpPost]
        public async Task<JsonResult> GetDashboardMailAlert([FromBody] DashboardOverview_GetDashboardMailAlertDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DashboardMailAlert getdata = new DashboardMailAlert();
            getdata.ToEmailId = user.EmailId;

            using (var objDL =  DLDashboardMailAlert.GetDLDashboardMailAlert(objDto.accountId,SQLProvider))
            {
                getdata =await objDL.GetDetail(objDto.Id);
            }
            return Json(getdata);
        }
        [HttpPost]
        public async Task<JsonResult> GetDashboardAllMailAlert([FromBody] DashboardOverview_GetDashboardAllMailAlertDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            IEnumerable<P5GenralML.DashboardMailAlert> alertList = null;

            using (var objDL =  DLDashboardMailAlert.GetDLDashboardMailAlert(objDto.accountId,SQLProvider))
            {
                alertList =await objDL.GetAllMailAlerts();
            }
            return Json(alertList);
        }
    }
}
