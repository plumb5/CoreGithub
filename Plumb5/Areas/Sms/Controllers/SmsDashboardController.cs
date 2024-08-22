using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SmsDashboardController : BaseController
    {
        public SmsDashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Sms/SmsDashboard/

        public IActionResult Index()
        {
            return View("SmsDashboard");
        }
        public async Task<ActionResult> GetCampaignEffectivenessData([FromBody] SmsDashboard_GetCampaignEffectivenessDataDto SmsDashboardDto)
        {
            List<MLSmsDashboardCampaignEffectiveness> dashboardDetails = null;
            using (var objDL =  DLSmsDashboardReport.GetDLSmsDashboardReport(SmsDashboardDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetCampaignEffectivenessData(SmsDashboardDto.fromdate, SmsDashboardDto.todate);
            }
            return Json(dashboardDetails);

        }
        public async Task<JsonResult>  GetSmsDashboardEngagementData([FromBody] SmsDashboard_GetSmsDashboardEngagementDataDto SmsDashboardDto)
        {
            List<MLSmsDashboardEngagement> dashboardDetails = null;
            using (var objDL = DLSmsDashboardReport.GetDLSmsDashboardReport(SmsDashboardDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetSmsDashboardEngagementData(SmsDashboardDto.fromdate, SmsDashboardDto.todate);
            }

            return Json(dashboardDetails );
        }
        public async Task<JsonResult> GetSmsDashboardDeliveryData([FromBody] SmsDashboard_GetSmsDashboardDeliveryDataDto SmsDashboardDto)
        {
            List<MLSmsDashboardDelivery> dashboardDetails = null;
            using (var objDL =   DLSmsDashboardReport.GetDLSmsDashboardReport(SmsDashboardDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetSmsDashboardDeliveryData(SmsDashboardDto.fromdate, SmsDashboardDto.todate);
            }

            return Json(dashboardDetails );
        }

        public async Task<JsonResult> GetSmsPerformanceOverTimeData([FromBody] SmsDashboard_GetSmsPerformanceOverTimeDataDto SmsDashboardDto)
        {
            List<MLSmsDashboardSmsPerformanceOverTime> dashboardDetails = null;
            using (var objDL = DLSmsDashboardReport.GetDLSmsDashboardReport(SmsDashboardDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetSmsPerformanceOverTimeData(SmsDashboardDto.fromdate, SmsDashboardDto.todate);
            }

            return Json(dashboardDetails);
        }
        public async Task<JsonResult> GetSmsDashboardBouncedRejectedData([FromBody] SmsDashboard_GetSmsDashboardBouncedRejectedDataDto SmsDashboardDto)
        {
            List<MLSmsDashboardBouncedVsRejected> dashboardDetails = null;
            using (var objDL = DLSmsDashboardReport.GetDLSmsDashboardReport(SmsDashboardDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetSmsDashboardBouncedRejectedData(SmsDashboardDto.fromdate, SmsDashboardDto.todate);
            }

            return Json(dashboardDetails );
        }

    }
}
