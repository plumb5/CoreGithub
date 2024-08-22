using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Areas.CustomEvents.Dto;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class ViewAggregateEventDataController : BaseController
    {
        public ViewAggregateEventDataController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ViewAggregateEventData");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ViewAggregateEventData_GetMaxCountDto details)
        {
            HttpContext.Session.SetInt32("CustomEventOverViewId", details.customeventoverviewid);
            HttpContext.Session.SetString("groupbyeventfields", details.groupbyeventfields);
            HttpContext.Session.SetString("displayextrafields", details.displayextrafields);
            HttpContext.Session.SetString("DisplayFieldsforexport", details.DisplayFieldsforexport);

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;

            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                returnVal = await objBL.GetAggergatecounts(FromDateTime, ToDateTime, details.customeventoverviewid, details.groupbyeventfields, details.displayextrafields);
            }

            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<ActionResult> GetAggregateData([FromBody] ViewAggregateEventData_GetAggregateDataDto details)
        {
            List<Customevents> CustomEventsDetails = null;

            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                DataSet = await objBL.GetAggregateData(details.fromDateTime, details.toDateTime, details.customeventoverviewid, details.groupbyeventfields, details.displayextrafields, details.OffSet, details.FetchNext);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldData([FromBody] ViewAggregateEventData_GetEventExtraFieldDataDto details)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(details.fromDateTime))
                FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(details.toDateTime))
                ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(details.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(details.customEventOverViewId, FromDateTime, ToDateTime, details.contactid);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldsData([FromBody] ViewAggregateEventData_GetEventExtraFieldsDataDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(details.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(details.customEventOverViewId, FromDateTime, ToDateTime, details.contactid);
            }
            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxAggregateDetails([FromBody] ViewAggregateEventData_GetMaxAggregateDetailsDto details)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<Customevents> Agggregatedata = new List<Customevents>();
            List<Customevents> ContactDetails = new List<Customevents>();

            for (var a = 0; a < details.DisplayCustomExtraFields.Count; a++)
            {
                string Checkfordatatype = "";
                var queryforaggrgatedetails = "";
                var groupbyquery = "";
                string CustomFieldname = "";

                Checkfordatatype = details.eventextrafiledsName[Convert.ToInt32(details.DisplayCustomExtraFields[a].Substring(9 - 0)) - 1].FieldMappingType;
                if (Checkfordatatype == "number")
                {
                    queryforaggrgatedetails = "select  coalesce(sum(cast(" + details.DisplayCustomExtraFields[a] + " as float)),0)  " + details.DisplayCustomExtraFields[a] + ",cast(0 as bigint) as ab FROM CustomEvents where  ";
                    groupbyquery += "";
                }
                else
                {
                    queryforaggrgatedetails += "select " + details.DisplayCustomExtraFields[a] + " ,count(1) ab  FROM CustomEvents where";
                    groupbyquery += "group by " + details.DisplayCustomExtraFields[a] + " having count(1)>0 order by count(1) desc  limit 1  ;";
                }

                CustomFieldname = details.DisplayCustomExtraFields[a];

                using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
                {
                    Agggregatedata = (await objBL.GetMaxAggregateDetails(FromDateTime, ToDateTime, details.customeventoverviewid, details.OffSet, details.FetchNext, details.eventFileds, queryforaggrgatedetails, groupbyquery, CustomFieldname)).ToList();
                    ContactDetails.AddRange(Agggregatedata);
                }
            }

            return Json(ContactDetails);
        }

        public async Task<JsonResult> GetUniqueContactDetails([FromBody] ViewAggregateEventData_GetUniqueContactDetailsDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Contact> ContactDetails = null;
            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                ContactDetails = (await objBL.GeteventcontactData(FromDateTime, ToDateTime, details.customeventoverviewid, details.OffSet, details.FetchNext, details.eventFileds)).ToList();
            }
            return Json(ContactDetails);
        }

        public async Task<JsonResult> GetUniquevisitorDetails([FromBody] ViewAggregateEventData_GetUniquevisitorDetailsDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> ContactDetails = null;
            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                ContactDetails = (await objBL.GetUniquevisitorDetails(FromDateTime, ToDateTime, details.customeventoverviewid, details.OffSet, details.FetchNext, details.eventFileds)).ToList();
            }

            return Json(ContactDetails);
        }

        [HttpPost]
        public async Task<ActionResult> ExportAggregateCustomViewReport([FromBody] ViewAggregateEventData_ExportAggregateCustomViewReportDto details)
        {
            int customEventOverViewId = Convert.ToInt32(HttpContext.Session.GetInt32("CustomEventOverViewId"));
            string groupbyeventfields = HttpContext.Session.GetString("groupbyeventfields").ToString();
            string displayextrafields = HttpContext.Session.GetString("displayextrafields").ToString();
            string DisplayFieldsforexport = HttpContext.Session.GetString("DisplayFieldsforexport").ToString();

            ExportViewEventsData Aggregatedataexport = new ExportViewEventsData(details.AccountId, SQLProvider);
            await Aggregatedataexport.Exportaggregatedata(details.FromDateTime, details.TodateTime, customEventOverViewId, groupbyeventfields, displayextrafields, DisplayFieldsforexport, details.FileType, details.OffSet, details.FetchNext);

            return Json(new { Status = true,  Aggregatedataexport.MainPath });
        }
    }
}
