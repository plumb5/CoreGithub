using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Revenue.Dto;
using Plumb5.Areas.Revenue.Models;
using Plumb5.Controllers;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Controllers
{
    [Area("Revenue")]
    public class RevenueCustomEventViewDetailsController : BaseController
    {
        public RevenueCustomEventViewDetailsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("RevenueCustomEventViewDetails");
        }
        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] RevenueCustomEventViewDetails_MaxCountDto details)
        {

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal = 0;

            if (!string.IsNullOrEmpty(details.Channel))
            {
                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.accountId, SQLProvider))
                {
                    returnVal = await objBL.GetIndividualRevenueCount(details.Channel, details.CampaignId, details.EventName, FromDateTime, ToDateTime, details.CampignType);
                }
            }
            else
            {
                using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
                {
                    returnVal = await objBL.GetRevenueMaxCount(details.customeventoverviewid, FromDateTime, ToDateTime);
                }
            }

            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetRevenueCstDetails([FromBody] RevenueCustomEventViewDetails_GetRevenueCstDetailsDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.todatetime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> CustomEventsCartDetails = null;

            ArrayList arrayList = new ArrayList() { details.customeventoverviewid, details.Channel, details.CampaignId, details.EventName, details.CampignType };
            HttpContext.Session.SetString("RevenueCstEvtDetailsCstID", JsonConvert.SerializeObject(arrayList));


            if (!string.IsNullOrEmpty(details.Channel))
            {
                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(details.accountId, SQLProvider))
                {
                    CustomEventsCartDetails = (await objBL.GetIndividualRevenueData(details.Channel, details.CampaignId, details.EventName, FromDateTime, ToDateTime, details.OffSet, details.FetchNext, details.CampignType)).ToList();
                }
            }
            else
            {
                using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
                {
                    CustomEventsCartDetails = (await objBL.GetRevenueEventsReportData(FromDateTime, ToDateTime, details.customeventoverviewid, details.OffSet, details.FetchNext)).ToList();
                }
            }

            return Json(CustomEventsCartDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldData([FromBody] RevenueCustomEventViewDetails_GetEventExtraFieldDataDto details)
        {

            List<CustomEventExtraField> CustomExtraFieldDetails = null;


            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(details.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.RevenueGetCustomEventExtraField(details.customEventOverViewId);
            }

            return Json(CustomExtraFieldDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetEventsDetails([FromBody] RevenueCustomEventViewDetails_GetEventsDetailsDto details)
        {
            List<Customevents> CustomEventsCartDetails = null;
            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                CustomEventsCartDetails = (await objBL.GetRevenuesingleEventsReportData(details.customeventoverviewid, details.Id)).ToList();
            }
            return Json(CustomEventsCartDetails);
        }
        [HttpPost]
        public async Task<ActionResult> RevenueExportCstEvtDetailsReport([FromBody] RevenueCustomEventViewDetails_RevenueExportCstEvtDetailsReportDto details)
        {
            ExportViewEventsData exporttoexceldetails = new ExportViewEventsData(details.AccountId, SQLProvider);
            DateTime FromDateTimes = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int customEventOverViewId = 0;
            string Channel = "";
            int CampaignId = 0;
            string EventName = "";
            Int16 CampignType = 0;
            if (HttpContext.Session.GetString("RevenueCstEvtDetailsCstID") != null)
            {
                ArrayList? extradata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("RevenueCstEvtDetailsCstID"));
                customEventOverViewId = Convert.ToInt32(extradata[0]);
                Channel = Convert.ToString(extradata[1]);
                CampaignId = Convert.ToInt32(extradata[2]);
                EventName = Convert.ToString(extradata[3]);
                CampignType = Convert.ToInt16(extradata[4]);
            }


            Customevents customevents = new Customevents();
            Contact contact = new Contact();

            if (HttpContext.Session.GetString("ContactDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ContactDetails"));
                contact = (Contact)data[0];
            }
            if (HttpContext.Session.GetString("customeventdetails") != null)
            {
                ArrayList? extradata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("customeventdetails"));
                customevents = (Customevents)extradata[0];
            }
            exporttoexceldetails.ExportCustomised(customEventOverViewId, FromDateTimes, ToDateTime, 0, details.OffSet, details.FetchNext, details.FileType, contact, null, customevents, "Revenue", Channel, CampaignId, EventName, CampignType);


            return Json(new { Status = true, exporttoexceldetails.MainPath });
        }
    }
}
