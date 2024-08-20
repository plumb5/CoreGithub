using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5.Areas.Revenue.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Controllers
{
    [Area("Revenue")]
    public class RevenueChannelsController : BaseController
    {
        public RevenueChannelsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> GetEventnames([FromBody] RevenueChannels_GetEventnamesDto details)
        {
            List<RevenueMapping> customEvents = null;

            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
            {
                customEvents = await objBL.GetSettingFieldNames();
            }

            return Json(customEvents);
        }
        [HttpPost]
        public async Task<JsonResult> GetDayWiseRevenue([FromBody] RevenueChannels_GetDayWiseRevenueDto details)
        {
            DataSet DayWiseRevenue = null;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string EventName = "";
            string EventPriceColumn = "";
            List<RevenueMapping> customEventsMapping = null;
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
            {
                customEventsMapping = await objBL.GetRevenueFiledsNameById(details.CustomEventOverViewId);
            }

            if (customEventsMapping != null && customEventsMapping.Count > 0)
            {
                EventName = customEventsMapping[0].CustomEventName;
                for (int i = 0; i < customEventsMapping.Count; i++)
                {
                    if (i == 0)
                        EventPriceColumn += $"CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                    else
                        EventPriceColumn += $"* CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                }

                EventPriceColumn = $"({EventPriceColumn})";

                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.AccountId, SQLProvider))
                {
                    DayWiseRevenue = await objBL.GetDayWiseRevenue(EventName, EventPriceColumn, FromDateTime, ToDateTime);
                }
            }

            return Json(JsonConvert.SerializeObject(DayWiseRevenue, Formatting.Indented));
        }
        [HttpPost]
        public async Task<JsonResult> GetChannelCount([FromBody] RevenueChannels_GetChannelCountDto details)
        {
            DataSet ChanneCount = null;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string EventName = "";
            string EventPriceColumn = "";
            List<RevenueMapping> customEventsMapping = null;
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
            {
                customEventsMapping = await objBL.GetRevenueFiledsNameById(details.CustomEventOverViewId);
            }

            if (customEventsMapping != null && customEventsMapping.Count > 0)
            {
                EventName = customEventsMapping[0].CustomEventName;
                for (int i = 0; i < customEventsMapping.Count; i++)
                {
                    if (i == 0)
                        EventPriceColumn += $"CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                    else
                        EventPriceColumn += $"* CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                }

                EventPriceColumn = $"({EventPriceColumn})";

                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.AccountId, SQLProvider))
                {
                    ChanneCount = await objBL.GetChannelCount(EventName, EventPriceColumn, FromDateTime, ToDateTime);
                }
            }

            return Json(JsonConvert.SerializeObject(ChanneCount, Formatting.Indented));
        }
        [HttpPost]
        public async Task<JsonResult> GetRevenueMaxCount([FromBody] RevenueChannels_GetRevenueMaxCountDto details)
        {
            int TotalCount = 0;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string EventName = "";
            string EventPriceColumn = "";
            List<RevenueMapping> customEventsMapping = null;
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
            {
                customEventsMapping = await objBL.GetRevenueFiledsNameById(details.CustomEventOverViewId);
            }

            if (customEventsMapping != null && customEventsMapping.Count > 0)
            {
                EventName = customEventsMapping[0].CustomEventName;
                for (int i = 0; i < customEventsMapping.Count; i++)
                {
                    if (i == 0)
                        EventPriceColumn += $"CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                    else
                        EventPriceColumn += $"* CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                }

                EventPriceColumn = $"({EventPriceColumn})";

                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.AccountId, SQLProvider))
                {
                    TotalCount = await objBL.GetRevenueMaxCount(details.Channel, EventName, EventPriceColumn, FromDateTime, ToDateTime);
                }
            }

            return Json(TotalCount);
        }
        [HttpPost]
        public async Task<JsonResult> GetRevenueData([FromBody] RevenueChannels_GetRevenueDataDto details)
        {
            DataSet RevenueData = null;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { details.Channel, details.CustomEventOverViewId };
            HttpContext.Session.SetString("CustomEventRevenueData", JsonConvert.SerializeObject(data));

            string EventName = "";
            string EventPriceColumn = "";
            List<RevenueMapping> customEventsMapping = null;
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
            {
                customEventsMapping = await objBL.GetRevenueFiledsNameById(details.CustomEventOverViewId);
            }

            if (customEventsMapping != null && customEventsMapping.Count > 0)
            {
                EventName = customEventsMapping[0].CustomEventName;
                for (int i = 0; i < customEventsMapping.Count; i++)
                {
                    if (i == 0)
                        EventPriceColumn += $"CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                    else
                        EventPriceColumn += $"* CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                }

                EventPriceColumn = $"({EventPriceColumn})";

                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.AccountId, SQLProvider))
                {
                    RevenueData = await objBL.GetRevenueData(details.Channel, EventName, EventPriceColumn, FromDateTime, ToDateTime, details.OffSet, details.FetchNext);
                }
            }

            return Json(JsonConvert.SerializeObject(RevenueData, Formatting.Indented));
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] RevenueChannels_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                DataSet RevenueData = null;

                string Channel = "";
                int CustomEventOverViewId = 0;
                DateTime fromDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                if (HttpContext.Session.GetString("CustomEventRevenueData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CustomEventRevenueData"));
                    Channel = Convert.ToString(data[0]);
                    CustomEventOverViewId = Convert.ToInt32(data[1]);
                }

                string EventName = "";
                string EventPriceColumn = "";
                List<RevenueMapping> customEventsMapping = null;
                using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.AccountId, SQLProvider))
                {
                    customEventsMapping = await objBL.GetRevenueFiledsNameById(CustomEventOverViewId);
                }

                if (customEventsMapping != null && customEventsMapping.Count > 0)
                {
                    EventName = customEventsMapping[0].CustomEventName;
                    for (int i = 0; i < customEventsMapping.Count; i++)
                    {
                        if (i == 0)
                            EventPriceColumn += $"CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                        else
                            EventPriceColumn += $"* CAST(CE.{customEventsMapping[i].CustomEventFiledName} AS NUMERIC)";
                    }

                    EventPriceColumn = $"({EventPriceColumn})";

                    using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.AccountId, SQLProvider))
                    {
                        RevenueData = await objBL.GetRevenueData(Channel, EventName, EventPriceColumn, fromDateTime, toDateTime, details.OffSet, details.FetchNext);
                    }

                    dataSet = RevenueData;

                    string FileName = "MailCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (details.FileType.ToLower() == "csv")
                        Helper.SaveDataSetToCSV(dataSet, MainPath);
                    else
                        Helper.SaveDataSetToExcel(dataSet, MainPath);

                    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                    return Json(new { Status = true, MainPath });
                }
                else
                {
                    return Json(new { Status = false });
                }
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
