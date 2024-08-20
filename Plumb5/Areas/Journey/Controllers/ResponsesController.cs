using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using System.Globalization;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class ResponsesController : BaseController
    {
        public ResponsesController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Journey/Responses/

        public IActionResult Index()
        {
            return View("Responses");
        }

        [HttpPost]
        public async Task<IActionResult> GetWorkFlowAllResponces([FromBody] Responses_GetWorkFlowAllResponcesDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DateTime? FromDateTime = null, ToDateTime = null;

            if (!string.IsNullOrEmpty(commonDetails.FromDate) && !string.IsNullOrEmpty(commonDetails.ToDate))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            dynamic? DsResponces = "";
            if (commonDetails.ChannelName.ToLower() == "mail")
            {
                using (var obj = DLWorkFlowMail.GetDLWorkFlowMail(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId, FromDateTime, ToDateTime, commonDetails.IsSplitTested, commonDetails.EmailId);
                }
            }
            else if (commonDetails.ChannelName.ToLower() == "sms")
            {
                using (var obj = DLWorkFlowSMS.GetDLWorkFlowSMS(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId, FromDateTime, ToDateTime, commonDetails.IsSplitTested, commonDetails.PhoneNumber);
                }
            }


            else if (commonDetails.ChannelName.ToLower() == "webpush")
            {
                using (var obj = DLWorkFlowWebPush.GetDLWorkFlowWebPush(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetCountsData(commonDetails.ConfigureId, FromDateTime, ToDateTime, commonDetails.IsSplitTested, commonDetails.MachineId);
                }
            }

            else if (commonDetails.ChannelName.ToLower() == "apppush")
            {
                using (var obj = DLWorkFlowMobile.GetDLWorkFlowMobile(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetCountsData(commonDetails.ConfigureId, FromDateTime, ToDateTime, commonDetails.IsSplitTested, commonDetails.DeviceId);
                }
            }

            else if (commonDetails.ChannelName.ToLower() == "webhook")
            {
                using (var obj = DLWorkFlowWebHook.GetDLWorkFlowWebHook(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetCountsData(commonDetails.ConfigureId, FromDateTime, ToDateTime);
                }
            }
            else if (commonDetails.ChannelName.ToLower() == "whatsapp")
            {
                using (var obj = DLWorkFlowWhatsApp.GetDLWorkFlowWhatsApp(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId, FromDateTime, ToDateTime, commonDetails.IsSplitTested, commonDetails.PhoneNumber);
                }
            }
            var getdata = JsonConvert.SerializeObject(DsResponces, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetails([FromBody] Responses_GetContactDetails commonDetails)
        {
            MLVisitorInformation? mLVisitorInformation = new MLVisitorInformation { EmailId = commonDetails.EmailId, PhoneNumber = commonDetails.PhoneNumber, MachineId = commonDetails.MachineId, DeviceId = commonDetails.DeviceId };
            using (var bLVisitorInformation = DLVisitorInformation.GetDLVisitorInformation(commonDetails.accountId, SQLProvider))
            {
                mLVisitorInformation = await bLVisitorInformation.GetContactDetails(mLVisitorInformation);
            }

            return Json(mLVisitorInformation);
        }
    }
}
