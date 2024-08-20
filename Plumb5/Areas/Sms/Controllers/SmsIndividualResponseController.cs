using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;
using Plumb5.Areas.Sms.Models;
using Plumb5.Areas.Sms.Dto;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SmsIndividualResponseController : BaseController
    {
        public SmsIndividualResponseController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Sms/SmsIndividualResponse/

        public IActionResult Index()
        {
            return View("SmsIndividualResponse");
        }

        public  async Task<JsonResult> IndividualMaxCount([FromBody] SmsIndividualResponse_IndividualMaxCountDto SmsIndividualResponseDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(SmsIndividualResponseDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(SmsIndividualResponseDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal = 0;
            using (var objDL =   DLSmsSent.GetDLSmsSent(SmsIndividualResponseDto.AdsId,SQLProvider))
            {
                returnVal = await objDL.IndividualMaxCount(FromDateTime, ToDateTime, SmsIndividualResponseDto.Phonenumber);
            }
            ArrayList exportdata = new ArrayList() { SmsIndividualResponseDto.Phonenumber };
            HttpContext.Session.SetString("SmsIndividualResponse", JsonConvert.SerializeObject(exportdata)); 
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetIndividualResponseData([FromBody] SmsIndividualResponse_GetIndividualResponseDataDto SmsIndividualResponseDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(SmsIndividualResponseDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(SmsIndividualResponseDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            IndividualSmsSentDetails individualSmsSentDetails = new IndividualSmsSentDetails();
            List<IndividualSmsSent> individualSmsSents = await individualSmsSentDetails.GetIndividualSmsResponseData(SmsIndividualResponseDto.AdsId, FromDateTime, ToDateTime, SmsIndividualResponseDto.OffSet, SmsIndividualResponseDto.FetchNext, SmsIndividualResponseDto.Phonenumber,SQLProvider);

            return Json(individualSmsSents );
        }

        [Log]
        public async Task<ActionResult>  ExportSmsAlertNotification([FromBody] SmsIndividualResponse_ExportSmsAlertNotificationDto SmsIndividualResponseDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            string Phonenumber = "";
            if (HttpContext.Session.GetString("SmsIndividualResponse") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsIndividualResponse"));
                Phonenumber = (string?)data[0]; 
            }
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<IndividualSmsSent> individualSmsSents = null;

            DateTime FromDateTimes = DateTime.ParseExact(SmsIndividualResponseDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(SmsIndividualResponseDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            IndividualSmsSentDetails individualSmsSentDetails = new IndividualSmsSentDetails();
            individualSmsSents = await individualSmsSentDetails.GetIndividualSmsResponseData(SmsIndividualResponseDto.AccountId, FromDateTimes, ToDateTime, SmsIndividualResponseDto.OffSet, SmsIndividualResponseDto.FetchNext, Phonenumber,SQLProvider);
            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(SmsIndividualResponseDto.AccountId,SQLProvider);
            var NewListData = individualSmsSents.Select(x => new
            {
                MessageContent = x.MessageContent.Replace("\n", " "),
                x.TemplateName,
                SentFrom = x.CampaignJobName,
                Sent = x.Sent == 1 ? "Yes" : "No",
                Bounced = x.NotDeliverStatus == 1 ? "Yes" : "No",
                Delivered = x.Delivered == 1 ? "Yes" : "No",
                Pending = x.Delivered == 1 ? "No" : "Yes",
                Clicked = x.Click == true ? "Yes" : "No",
                UrlLink = string.IsNullOrEmpty(x.UrlLink) ? "NA" : x.UrlLink,
                //TotalClick = x.UniqueClick,
                ErrorMessage = string.IsNullOrEmpty(x.ErrorMessage) ? "NA" : x.ErrorMessage,
                SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate.ToString())).ToString(),
                PhoneNumber = !String.IsNullOrEmpty(x.PhoneNumber) ? Helper.MaskPhoneNumber(x.PhoneNumber) : x.PhoneNumber,
                ContentType = x.IsPromotionalOrTransactionalType ? "Transactional" : "Promotional",
                TemplateWithVairable = !String.IsNullOrEmpty(Convert.ToString(x.MessageContent)) ? (x.MessageContent.ToString().Contains("[{*") || x.MessageContent.ToString().Contains("{{*") ? "True" : "False") : "False",
                Units = x.Units,
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "IndividualSmsResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + SmsIndividualResponseDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (SmsIndividualResponseDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
