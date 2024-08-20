using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class CustomEventsOverviewController : BaseController
    {
        public CustomEventsOverviewController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CustomEvents/CustomEventsOverview/

        public ActionResult Index()
        {
            return View("CustomEventsOverview");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] CustomEventsOverview_GetMaxCount commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objBL.MaxCount(commonDetails.CustomEventName, FromDateTime, ToDateTime);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] CustomEventsOverview_GetReportData commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventsOverView> CustomEventsDetails = null;
            HttpContext.Session.SetString("CustomEventName", commonDetails.CustomEventName);

            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.accountId, SQLProvider))
            {
                CustomEventsDetails = (await objBL.GetReportData(commonDetails.CustomEventName, FromDateTime, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
            }

            return Json(CustomEventsDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldData([FromBody] CustomEventsOverview_GetEventExtraFieldData commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(commonDetails.customEventOverViewId, FromDateTime, ToDateTime, commonDetails.contactid);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> UCPGetEventExtraFieldData([FromBody] CustomEventsOverview_UCPGetEventExtraFieldData commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.UCPGetCustomEventExtraField(commonDetails.customEventOverViewId, FromDateTime, ToDateTime, commonDetails.contactid);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldDataForDragDrop([FromBody] CustomEventsOverview_GetEventExtraFieldDataForDragDrop commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLCustomEventExtraField> CustomExtraFieldDetails = null;

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetEventExtraFieldDataForDragDrop(commonDetails.customEventOverViewId, FromDateTime, ToDateTime, commonDetails.contactid, commonDetails.EventNames);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetAllEventExtraFieldDataForDragDrop([FromBody] CustomEventsOverview_GetAllEventExtraFieldDataForDragDrop commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLCustomEventExtraField> CustomExtraFieldDetails = null;

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetAllEventExtraFieldDataForDragDrop(commonDetails.customEventOverViewId, FromDateTime, ToDateTime, commonDetails.contactid);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> DeleteCustomEventOverViewDetails([FromBody] CustomEventsOverview_DeleteCustomEventOverViewDetails commonDetails)
        {
            using (var objLmsLeads = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.DeleteCustomEventOverView(commonDetails.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> StopEventTrack([FromBody] CustomEventsOverview_DeleteCustomEventOverViewDetails commonDetails)
        {
            int returnVal;
            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.AccountId, SQLProvider))
            {
                returnVal = await objBL.StopCustomEventTrack(commonDetails.Id);
            }
            return Json(new
            {
                returnVal
            });

        }


        [HttpPost]
        public async Task<IActionResult> ExportCustomOverViewReport([FromBody] CustomEventsOverview_ExportCustomOverViewReport commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            string? CustomEventName = null;

            CustomEventName = Convert.ToString(HttpContext.Session.GetString("CustomEventName"));

            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<CustomEventsOverView> CustomEventsDetails = null;
            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.AccountId, SQLProvider))
            {
                CustomEventsDetails = (await objBL.GetReportData(CustomEventName, FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
            }

            var NewListData = CustomEventsDetails.Select(x => new
            {
                EventName = x.EventName,
                x.UpdatedDate
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "CustomEventOverView_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<JsonResult> UserAttrGetReportData([FromBody] CustomEventsOverview_UserAttrGetReportData commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventsOverView> CustomEventsDetails = null;

            HttpContext.Session.SetString("CustomEventName", JsonConvert.SerializeObject(commonDetails.CustomEventName));


            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.accountId, SQLProvider))
            {
                CustomEventsDetails = (await objBL.GetReportData(commonDetails.CustomEventName, FromDateTime, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
            }

            return Json(CustomEventsDetails);
        }

        [HttpPost]
        public async Task<JsonResult> UserAttrGetEventExtraFieldData([FromBody] CustomEventsOverview_UserAttrGetEventExtraFieldData commonDetails)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime))
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.toDateTime))
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(commonDetails.customEventOverViewId, FromDateTime, ToDateTime, commonDetails.contactid);
            }

            return Json(CustomExtraFieldDetails);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateDisplayOrder([FromBody] CustomEventsOverview_UpdateDisplayOrder commonDetails)
        {
            if (commonDetails.SettingList != null && commonDetails.SettingList.Count > 0)
            {
                using (var objDL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.AccountId, SQLProvider))
                {
                    for (int i = 0; i < commonDetails.SettingList.Count; i++)
                    {
                        await objDL.UpdateDisplayOrder(commonDetails.SettingList[i]);
                    }
                }
            }

            return Json(true);
        }

        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldDatasettings([FromBody] CustomEventsOverview_GetEventExtraFieldDatasettings commonDetails)
        {

            List<CustomEventExtraField> CustomExtraFieldDetails = null;

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(commonDetails.customEventOverViewId);
            }

            return Json(CustomExtraFieldDetails);
        }
    }
}
