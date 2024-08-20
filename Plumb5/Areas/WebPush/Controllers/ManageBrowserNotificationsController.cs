using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class ManageBrowserNotificationsController : BaseController
    {
        public ManageBrowserNotificationsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WebPush/ManageBrowserNotifications/

        #region Scheduled

        public IActionResult Scheduled()
        {
            return View("Scheduled");
        }

        [HttpPost]
        public async Task<IActionResult> GetScheduledMaxCount([FromBody] ManageBrowserNotificationsDto_GetScheduledMaxCount commonDetails)
        {
            try
            {
                DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                int returnVal;
                using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(commonDetails.AdsId, SQLProvider))
                {
                    returnVal = await objDL.MaxCount(FromDate, ToDate, commonDetails.Name);
                }
                return Json(new { returnVal });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetScheduledData([FromBody] ManageBrowserNotificationsDto_GetScheduledData commonDetails)
        {
            try
            {
                DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                List<WebPushSendingSetting> webPushSendingSettings = new List<WebPushSendingSetting>();
                HttpContext.Session.SetString("WebPushSchedules", commonDetails.Name);

                using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(commonDetails.AdsId, SQLProvider))
                {
                    webPushSendingSettings = await objDL.GetList(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, commonDetails.Name);
                }
                return Json(new { webPushSendingSettings });
            }
            catch
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportScheduleCampaign([FromBody] ManageBrowserNotificationsDto_ExportScheduleCampaign commonDetails)
        {

            DateTime FromDate = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<WebPushSendingSetting> webPushSendingSettings = new List<WebPushSendingSetting>();
            using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(commonDetails.AccountId, SQLProvider))
            {
                webPushSendingSettings = await objDL.GetList(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, Convert.ToString(HttpContext.Session.GetString("WebPushSchedules")));
            }

            var NewListData = webPushSendingSettings.Select(x => new
            {
                Name = x.Name,
                UpdatedOn = x.UpdatedDate.ToString(),
                ScheduledFor = x.ScheduledDate.ToString()
            });

            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushSchedule_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> DeleteScheduled([FromBody] ManageBrowserNotificationsDto_DeleteScheduled commonDetails)
        {
            using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.Delete(commonDetails.Id));
            }
        }

        #endregion

        #region Rss

        public ActionResult Rss()
        {
            return View("Rss");
        }

        [HttpPost]
        public async Task<IActionResult> GetRssMaxCount([FromBody] ManageBrowserNotificationsDto_GetRssMaxCount commonDetails)
        {
            try
            {
                DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                int returnVal;
                using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.AdsId, SQLProvider))
                {
                    returnVal = await objDL.MaxCount(FromDate, ToDate, commonDetails.CampaignName);
                }
                return Json(new { returnVal });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetRssData([FromBody] ManageBrowserNotificationsDto_GetRssData commonDetails)
        {
            try
            {
                DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                List<WebPushRssFeed> webPushRssFeeds = new List<WebPushRssFeed>();
                HttpContext.Session.SetString("WebPushRss", commonDetails.CampaignName ?? "");
                using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.AdsId, SQLProvider))
                {
                    webPushRssFeeds = await objDL.GetList(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, commonDetails.CampaignName);
                }
                return Json(new { webPushRssFeeds });
            }
            catch
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> ChangeRssStatus([FromBody] ManageBrowserNotificationsDto_ChangeRssStatus commonDetails)
        {
            using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.ChangeStatus(commonDetails.Id, commonDetails.Status));
            }
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> DeleteRss([FromBody] ManageBrowserNotificationsDto_DeleteRss commonDetails)
        {
            using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.Delete(commonDetails.Id));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportRssCampaign([FromBody] ManageBrowserNotificationsDto_ExportRssCampaign commonDetails)
        {
            DateTime FromDate = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<WebPushRssFeed> webPushRssFeeds = new List<WebPushRssFeed>();
            using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.AccountId, SQLProvider))
            {
                var CampaignName = HttpContext.Session.GetString("WebPushRss") != null ? Convert.ToString(HttpContext.Session.GetString("WebPushRss")) : null;
                webPushRssFeeds = await objDL.GetList(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, CampaignName);
            }

            var NewListData = webPushRssFeeds.Select(x => new
            {
                Name = x.CampaignName,
                UpdatedOn = x.UpdatedDate.ToString(),
                RssUrl = x.RssUrl
            });

            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushRss_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        #endregion

        #region Draft

        public IActionResult Draft()
        {
            return View("Draft");
        }

        #endregion

        [Log]
        [HttpPost]
        public async Task<IActionResult> ExportCampaignIdentifier([FromBody] ManageBrowserNotificationsDto_ExportCampaignIdentifier commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<CampaignIdentifier> campaignDetails = null;
            CampaignIdentifier identifier = new CampaignIdentifier();
            if (HttpContext.Session.GetString("CampaignDetails") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CampaignDetails"));
                identifier = JsonConvert.DeserializeObject<CampaignIdentifier>(data[0].ToString());
            }

            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.AccountId, SQLProvider))
            {
                campaignDetails = await objDL.GetList(identifier, commonDetails.OffSet, commonDetails.FetchNext);
            }

            var NewListData = campaignDetails.Select(x => new
            {
                CampaignName = x.Name,
                Description = x.CampaignDescription,
                UpdatedOn = x.UpdatedDate.ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "CampaignIdentifierReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
