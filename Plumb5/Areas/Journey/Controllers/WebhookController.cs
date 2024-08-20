using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class WebhookController : BaseController
    {
        public WebhookController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> MaxCount([FromBody] Webhook_MaxCountDto details)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(details.fromDateTime) && !string.IsNullOrEmpty(details.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objDL = DLWebHookSent.GetDLWebHookSent(details.accountId, SQLProvider))
            {
                var data = await objDL.MaxCount(details.WebHookSendingSettingId, details.Sucess, FromDateTime, ToDateTime);
                return Json(data);
            }
        }

        public async Task<ActionResult> GetReportDetails([FromBody] Webhook_GetReportDetailsDto details)
        {
            List<MLWebHookSentDetails> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(details.fromDateTime) && !string.IsNullOrEmpty(details.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            using (var objDL = DLWebHookSent.GetDLWebHookSent(details.accountId, SQLProvider))
            {
                reportDetails = await objDL.GetWebHookSentDetails(details.WebHookSendingSettingId, details.Sucess, details.OffSet, details.FetchNext, FromDateTime, ToDateTime);
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                    {
                        reportDetails[i].EmailId = !String.IsNullOrEmpty(reportDetails[i].EmailId) ? Helper.MaskEmailAddress(reportDetails[i].EmailId) : reportDetails[i].EmailId;
                        reportDetails[i].PhoneNumber = !String.IsNullOrEmpty(reportDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(reportDetails[i].PhoneNumber) : reportDetails[i].PhoneNumber;
                    }
                }
            }
            return Json(reportDetails);
        }
    }
}
