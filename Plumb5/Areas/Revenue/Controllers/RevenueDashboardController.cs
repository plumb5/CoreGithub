using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5.Areas.Revenue.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Controllers
{
    [Area("Revenue")]
    public class RevenueDashboardController : BaseController
    {
        public RevenueDashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("RevenueDashboard");
        }

        [HttpPost]
        public async Task<JsonResult> GetFieldsName([FromBody] RevenueDashboard_GetFieldsNameDto details)
        {

            List<RevenueMapping> RevenueSettingFieldnames = null;

            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.accountId, SQLProvider))
            {
                RevenueSettingFieldnames = await objBL.GetSettingsFieldsName();
            }
            return Json(RevenueSettingFieldnames);
        }
        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] RevenueDashboard_MaxCountDto details)
        {

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;

            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                returnVal = await objBL.GetRevenueMaxCount(details.customeventoverviewid, FromDateTime, ToDateTime);
            }


            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<IActionResult> GetDetails([FromBody] RevenueDashboard_GetDetailsDto details)
        {
            string dynamicefieldnames = "";
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            List<RevenueMapping> RevenueEventFields = null;
            HttpContext.Session.SetInt32("RevenueCustomEventOverViewId", details.customeventoverviewid);
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.accountId, SQLProvider))
            {
                RevenueEventFields = await objBL.Geteventfileds(details.customeventoverviewid);
            }
            if (RevenueEventFields.Count == 1)
            {
                dynamicefieldnames = "sum(CAST(" + RevenueEventFields[0].CustomEventFiledName + " AS NUMERIC))";
            }
            else if (RevenueEventFields.Count > 1)
            {
                string _dynamicefieldnames = "";
                for (var a = 0; a < RevenueEventFields.Count; a++)
                {

                    _dynamicefieldnames += " CAST(" + RevenueEventFields[a].CustomEventFiledName + " AS NUMERIC) *";

                }
                dynamicefieldnames = "sum(" + _dynamicefieldnames.Remove(_dynamicefieldnames.Length - 1, 1) + ")";
            }
            HttpContext.Session.SetString("Revenuedynamicefieldnames", dynamicefieldnames);
            System.Data.DataSet DataSet = new System.Data.DataSet("General");

            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.accountId, SQLProvider))
            {
                DataSet = await objBL.GetRevenueDetails(details.customeventoverviewid, dynamicefieldnames, FromDateTime, ToDateTime, details.OffSet, details.FetchNext, details.BindType);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<IActionResult> ExportDashboardReport([FromBody] RevenueDashboard_ExportDashboardReportDto details)
        {
            ExportViewEventsData exporttoexceldetails = new ExportViewEventsData(details.AccountId, SQLProvider);
            DateTime FromDateTimes = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int revenuecustomEventOverViewId = Convert.ToInt32(HttpContext.Session.GetInt32("RevenueCustomEventOverViewId"));
            string Revenuedynamicefieldnames = Convert.ToString(HttpContext.Session.GetString("Revenuedynamicefieldnames"));

            System.Data.DataSet DataSet = new System.Data.DataSet("General");

            using (var objBL = DLCustomEvents.GetDLCustomEvents(details.AccountId, SQLProvider))
            {
                DataSet = await objBL.GetRevenueDetails(revenuecustomEventOverViewId, Revenuedynamicefieldnames, FromDateTimes, ToDateTime, details.OffSet, details.FetchNext, "");
            }
            string FileName = "RevenueDashboardDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(DataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(DataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
