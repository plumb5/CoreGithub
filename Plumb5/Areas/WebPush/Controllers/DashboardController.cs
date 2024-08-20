using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using System.Globalization;
using P5GenralDL;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WebPush/Dashboard/

        public IActionResult Index()
        {
            return View("Dashboard");
        }

        [HttpPost]
        public async Task<JsonResult> GetSubcribersDetails([FromBody] DashboardDto_GetSubcribersDetails commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var webPushDashboard = DLWebPushDashboard.GetDLWebPushDashboard(commonDetails.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetSubcribersDetails(FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignDetails([FromBody] DashboardDto_GetCampaignDetails commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var webPushDashboard = DLWebPushDashboard.GetDLWebPushDashboard(commonDetails.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetCampaignDetails(FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetNotificationDetails([FromBody] DashboardDto_GetNotificationDetails commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var webPushDashboard = DLWebPushDashboard.GetDLWebPushDashboard(commonDetails.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetNotificationDetails(FromDateTime, ToDateTime));
            }
        }
    }
}
