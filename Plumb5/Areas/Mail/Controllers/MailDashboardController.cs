using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailDashboardController : BaseController
    {
        public MailDashboardController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("MailDashboard");
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignEffectiveness([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MailDashboardCampaignEffectiveness> campaignEffectiveness = new List<MailDashboardCampaignEffectiveness>();
            using (var objDL = DLDashboardMail.GetDLDashboardMail(campaignEffectivenessDto.AdsId, SQLProvider))
            {
                campaignEffectiveness = await objDL.GetMailDashboardCampaignEffectiveness(FromDateTime, ToDateTime);
            }
            return Json(campaignEffectiveness);
        }

        [HttpPost]
        public async Task<JsonResult> GetEngagementDetails([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MailDashboadEngagement? mailEngagement = new MailDashboadEngagement();
            using (var objDL = DLDashboardMail.GetDLDashboardMail(campaignEffectivenessDto.AdsId, SQLProvider))
            {
                mailEngagement = await objDL.GetMailDashboadEngagement(FromDateTime, ToDateTime);
            }
            return Json(mailEngagement);
        }

        [HttpPost]
        public async Task<JsonResult> GetDeliveryDetails([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MailDashboardDelivery? mailDelivery = new MailDashboardDelivery();
            using (var objDL = DLDashboardMail.GetDLDashboardMail(campaignEffectivenessDto.AdsId, SQLProvider))
            {
                mailDelivery = await objDL.GetMailDashboardDelivery(FromDateTime, ToDateTime);
            }
            return Json(mailDelivery);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailPerformanceOverTime([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MailPerformanceOverTime> mailPerformanceDetails = new List<MailPerformanceOverTime>();
            using (var objDL = DLDashboardMail.GetDLDashboardMail(campaignEffectivenessDto.AdsId, SQLProvider))
            {
                mailPerformanceDetails = await objDL.GetMailPerformanceOverTime(FromDateTime, ToDateTime);
            }
            return Json(mailPerformanceDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailBouncedCategory([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLMailBouncedCategory> mailBouncedDetails = new List<MLMailBouncedCategory>();
            using (var objDL = DLMailBouncedContacts.GetDLMailBouncedContacts(campaignEffectivenessDto.AdsId, SQLProvider))
            {
                mailBouncedDetails = await objDL.GetBouncedCategory(FromDateTime, ToDateTime);
            }
            return Json(mailBouncedDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailEmailsOpenHourOfDay([FromBody] CampaignEffectivenessDto campaignEffectivenessDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(campaignEffectivenessDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(campaignEffectivenessDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DataSet dataSet = null;
            using (var objDL = DLMailBouncedContacts.GetDLMailBouncedContacts(campaignEffectivenessDto.AdsId, SQLProvider))
                dataSet = await objDL.GetMailEmailsOpenHourOfDay(FromDateTime, ToDateTime);

            string json = JsonConvert.SerializeObject(dataSet, Formatting.None);

            return Json(json);
        }
    }
}
