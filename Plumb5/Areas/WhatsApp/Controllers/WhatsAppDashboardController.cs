using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppDashboardController : BaseController
    {
        public WhatsAppDashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("WhatsAppDashboard");
        }
        [HttpPost]
        public async Task<ActionResult> GetCampaignEffectivenessData([FromBody] WhatsAppDashboard_GetCampaignEffectivenessDataDto objDto)
        {
            List<MLWhatsAppDashboardCampaignEffectiveness> dashboardDetails = null;
            using (var objBL = DLWhatsAppDashboardReport.GetDLWhatsaAppDashboardReport(objDto.accountId, SQLProvider))
            {
                dashboardDetails =(await objBL.GetCampaignEffectivenessData(objDto.fromdate, objDto.todate)).ToList();
            }
            return Json(dashboardDetails);

        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppDashboardSubcribersData([FromBody] WhatsAppDashboard_GetWhatsAppDashboardSubcribersDataDto objDto)
        {
            List<MLWhatsAppDashboardSubcribers> dashboardDetails = null;
            using (var objBL = DLWhatsAppDashboardReport.GetDLWhatsaAppDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =(await objBL.GetWhatsAppDashboardSubcribersData(objDto.fromdate, objDto.todate)).ToList();
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppDashboardDeliveryData([FromBody] WhatsAppDashboard_GetWhatsAppDashboardDeliveryDataDto objDto)
        {
            List<MLWhatsAppDashboardDelivery> dashboardDetails = null;
            using (var objBL = DLWhatsAppDashboardReport.GetDLWhatsaAppDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails = (await objBL.GetWhatsAppDashboardDeliveryData(objDto.fromdate, objDto.todate)).ToList();
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppDashboardDeliveredFailedData([FromBody] WhatsAppDashboard_GetWhatsAppDashboardDeliveredFailedDataDto objDto)
        {
            List<MLWhatsAppDashboardDeliveredVsFailed> dashboardDetails = null;
            using (var objBL = DLWhatsAppDashboardReport.GetDLWhatsaAppDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =(await objBL.GetWhatsAppDashboardDeliveredFailedData(objDto.fromdate, objDto.todate)).ToList();
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppPerformanceOverTimeData([FromBody] WhatsAppDashboard_GetWhatsAppPerformanceOverTimeDataDto objDto)
        {
            List<MLWhatsAppDashboardWhatsAppPerformanceOverTime> dashboardDetails = null;
            using (var objBL = DLWhatsAppDashboardReport.GetDLWhatsaAppDashboardReport(objDto.accountId,SQLProvider))
            {
                dashboardDetails =(await objBL.GetWhatsAppPerformanceOverTimeData(objDto.fromdate, objDto.todate)).ToList();
            }

            return Json(dashboardDetails);
        }
    }
}
