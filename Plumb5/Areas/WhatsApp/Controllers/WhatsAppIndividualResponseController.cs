using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Areas.WhatsApp.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppIndividualResponseController : BaseController
    {
        public WhatsAppIndividualResponseController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("WhatsAppIndividualResponse");
        }
        [HttpPost]
        public async Task<JsonResult> IndividualMaxCount([FromBody] WhatsAppIndividualResponse_IndividualMaxCountDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal = 0;
            using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.AdsId,SQLProvider))
            {
                returnVal =await objBL.IndividualMaxCount(FromDateTime, ToDateTime, objDto.WATemplateId, objDto.PhoneNumber);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetIndividualResponseData([FromBody] WhatsAppIndividualResponse_GetIndividualResponseDataDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            IndividualWhatsApppSentDetails individualwhatsappSentDetails = new IndividualWhatsApppSentDetails();
            List<IndividualWhatsAppSent> individualWhatsAppSents =await individualwhatsappSentDetails.GetIndividualwhatsAppResponseData(objDto.AdsId, FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext, objDto.WATemplateId, objDto.PhoneNumber,SQLProvider);

            return Json(individualWhatsAppSents);
        }
        [HttpPost]
        public async Task<ActionResult> ExportWhatsAppAlertNotification([FromBody] WhatsAppIndividualResponse_ExportWhatsAppAlertNotificationDto objDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<IndividualWhatsAppSent> individualWhatsAppSents = null;

            DateTime FromDateTimes = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            IndividualWhatsApppSentDetails individualwhatsappSentDetails = new IndividualWhatsApppSentDetails();
            individualWhatsAppSents =await individualwhatsappSentDetails.GetIndividualwhatsAppResponseData(objDto.AccountId, FromDateTimes, ToDateTime, objDto.OffSet, objDto.FetchNext,0,null,SQLProvider);
            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
            var NewListData = individualWhatsAppSents.Select(x => new
            {
                MessageContent = x.TemplateContent.Replace("\n", " "),
                x.TemplateName,
                SentFrom = x.CampaignJobName,
                Sent = x.Sent == 1 ? "Yes" : "No",
                Delivered = x.Delivered == 1 ? "Yes" : "No",
                Read = x.Read == 1 ? "Yes" : "No",
                Clicked = x.Click == 1 ? "Yes" : "No",
                UrlLink = string.IsNullOrEmpty(x.UrlLink) ? "NA" : x.UrlLink,
                Failed = x.IsFailed == 1 ? "Yes" : "No",
                ErrorMessage = string.IsNullOrEmpty(x.ReasonForNotDelivery) ? "NA" : x.ReasonForNotDelivery,
                SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate.ToString())).ToString(),
                PhoneNumber = !String.IsNullOrEmpty(x.PhoneNumber) ? Helper.MaskPhoneNumber(x.PhoneNumber) : x.PhoneNumber,
                TemplateType = x.Templatetype
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "IndividualWhatsAppResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
