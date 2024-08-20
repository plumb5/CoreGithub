using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Areas.Chat.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;

            return View("Dashboard");
        }


        [HttpPost]
        public async Task<JsonResult> GetChatReport([FromBody] Dashboard_GetChatReportDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLChatDashBoard> dashboardDetails = null;
            using (var objDL = DLChatDashBoard.GetDLCartDetails(objDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.GetChatReport(objDto.ChatId, objDto.Duration, FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> BindChatImpressionsCount([FromBody] Dashboard_BindChatImpressionsCountDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<MLChatDashBoard> dashboardDetails = null;
            using (var objDL = DLChatDashBoard.GetDLCartDetails(domainDetails.AdsId, SQLProvider))
            {
                dashboardDetails = await objDL.BindChatImpressionsCount(objDto.ChatId, FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> TopFiveConversion([FromBody] Dashboard_TopFiveConversionDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLChatDashBoard> dashboardDetails = null;
            using (var objDL = DLChatDashBoard.GetDLCartDetails(objDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.TopFiveConversion(FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> TopFiveConversionUrl([FromBody] Dashboard_TopFiveConversionUrlDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLChatDashBoard> dashboardDetails = null;
            using (var objDL = DLChatDashBoard.GetDLCartDetails(objDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.TopFiveConversionUrl(FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> Conversations([FromBody] Dashboard_ConversationsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            MLChatDashBoard dashboardDetails = null;
            using (var objDL = DLChatDashBoard.GetDLCartDetails(objDto.accountId, SQLProvider))
            {
                dashboardDetails = await objDL.Conversations(FromDateTime, ToDateTime);
            }

            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> TopThreeAgents([FromBody] Dashboard_TopThreeAgentsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLChatDashBoard> dashboardDetails = null;
            using (ChatDashboard obj = new ChatDashboard(objDto.accountId))
            {
                dashboardDetails = await obj.GetTopThreeAgents(FromDateTime, ToDateTime, SQLProvider);
            }
            return Json(dashboardDetails);
        }
    }
}
