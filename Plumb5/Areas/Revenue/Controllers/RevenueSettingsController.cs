using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Revenue.Dto;
using Plumb5.Controllers;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Controllers
{
    [Area("Revenue")]
    public class RevenueSettingsController : BaseController
    {
        public RevenueSettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("RevenueSettings");
        }
        [HttpPost]
        public async Task<JsonResult> GetEventnames([FromBody] RevenueSettings_GetEventnamesDto details)
        {
            string fromDateTime = null;
            string toDateTime = null;

            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(fromDateTime))
                FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(toDateTime))
                ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<CustomEventsOverView> CustomEventsDetails = null;
            using (var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(details.accountId, SQLProvider))
            {
                CustomEventsDetails = (await objBL.GetEventNamesForRevenue(FromDateTime, ToDateTime)).ToList();
            }

            return Json(CustomEventsDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetEventExtraFieldData([FromBody] RevenueSettings_GetEventExtraFieldDataDto details)
        {
            string fromDateTime = null;
            string toDateTime = null;

            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(fromDateTime))
                FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(toDateTime))
                ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(details.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetEventExtraFieldForRevenue(details.customEventOverViewId, FromDateTime, ToDateTime);
            }

            return Json(CustomExtraFieldDetails);
        }
        [HttpPost]
        public async Task<JsonResult> SaveRevenue([FromBody] RevenueSettings_SaveRevenueDto details)
        {
            List<RevenueMapping> RevenueSettingsList = JsonConvert.DeserializeObject<List<RevenueMapping>>(details.RevenueSettings);

            var returnVal = 0;
            if (RevenueSettingsList.Count > 0)
            {

                using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.accountId, SQLProvider))
                {
                    objBL.Delete();
                    foreach (RevenueMapping revenue in RevenueSettingsList)
                    {
                        returnVal = await objBL.Save(revenue);
                    }
                }
            }
            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<JsonResult> GetRevenueSettingsData([FromBody] RevenueSettings_GetRevenueSettingsDataDto details)
        {
            List<RevenueMapping> CustomExtraFieldDetails = null;
            using (var objBL = DLRevenueMapping.GetDLRevenueMapping(details.accountId, SQLProvider))
            {
                CustomExtraFieldDetails = await objBL.GetRevenueData();
            }

            return Json(CustomExtraFieldDetails);
        }
    }
}
