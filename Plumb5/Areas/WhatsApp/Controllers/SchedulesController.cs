using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class SchedulesController : BaseController
    {
        public SchedulesController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Schedules");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Schedules_GetMaxCountDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            using (var objBL = DLWhatsAppScheduledReport.GetDLWhatsAppScheduledReport(domainDetails.AdsId,SQLProvider))
            {
                return Json(await objBL.GetMaxCount(FromDateTime, ToDateTime, objDto.CampignName));
            }
        }
        [HttpPost]
        public async Task<JsonResult> ShowSetSchedule([FromBody] Schedules_ShowSetScheduleDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<string> fieldsName = new List<string>() { "WhatsAppSendingSettingId", "WhatsAppCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "ScheduledStatus", "ScheduleBatchType", "GroupName", "StoppedReason" };
            List<MLWhatsAppScheduled> MLWhatsAppScheduleds = null;
            MLWhatsAppScheduled schdule_Obj = new MLWhatsAppScheduled();
            schdule_Obj.WhatsAppCampaignName = objDto.CampignName;
            ArrayList data = new ArrayList() { schdule_Obj };
            HttpContext.Session.SetString("WhatsAppSchedules", JsonConvert.SerializeObject(data));

            using (var objBL = DLWhatsAppScheduledReport.GetDLWhatsAppScheduledReport(domainDetails.AdsId,SQLProvider))
            {
                MLWhatsAppScheduleds =await objBL.GetScheduled(objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime, fieldsName, objDto.CampignName);
                return Json(MLWhatsAppScheduleds);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportScheduleCampaign([FromBody] Schedules_ExportScheduleCampaignDto objDto)
        {
            List<MLWhatsAppScheduled> campaignDetails = null;
            MLWhatsAppScheduled schdule_Obj = new MLWhatsAppScheduled();
            List<string> fieldsName = new List<string>() { "WhatsAppSendingSettingId", "WhatsAppCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "ScheduleBatchType", "GroupName" };
            ArrayList schData = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppSchedules"));
            schdule_Obj = JsonConvert.DeserializeObject<MLWhatsAppScheduled>(schData[0].ToString());

            DateTime FrmDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


            using (var objBL = DLWhatsAppScheduledReport.GetDLWhatsAppScheduledReport(objDto.AccountId,SQLProvider))
            {
                campaignDetails = await objBL.GetScheduled(objDto.OffSet, objDto.FetchNext, FrmDateTime, ToDateTime, fieldsName, schdule_Obj.WhatsAppCampaignName);
            }
            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
            var NewListData = campaignDetails.Select(x => new
            {
                Name = x.WhatsAppCampaignName,
                Description = x.CampaignDescription,
                GroupName = x.GroupName != null ? x.GroupName : "NA",
                UpdatedOn = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate.ToString())).ToString(),
                ScheduledFor = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate.ToString())).ToString()
            });

            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "WhatsAppSchedule_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateScheduledDrip([FromBody] Schedules_UpdateScheduledDripDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedules", "Mail", "UpdateScheduledDrip", Helper.GetIP(), JsonConvert.SerializeObject(new { mailDrips = mailDrips }));
            //#endregion

            using (var objBLMailSchedule = DLMailDrips.GetDLMailDrips(domainDetails.AdsId,SQLProvider))
            {
                bool result =await objBLMailSchedule.UpdateDripDetails(objDto.mailDrips);
                //if (result)
                //    LogMessage = "The mail drip schedule has been updated";
                //else
                //    LogMessage = "Unable to update mail drip schedule";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Schedules_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLMailScheduled> mailScheduled = null;

                DateTime FromDateTime = DateTime.Now;
                DateTime ToDateTime = DateTime.Now;

                if (HttpContext.Session.GetString("MailSchedules") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailSchedules"));
                    FromDateTime = Convert.ToDateTime(data[0]);
                    ToDateTime = Convert.ToDateTime(data[1]);
                }

                using (var objBL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId,SQLProvider))
                {
                    mailScheduled =await objBL.GetScheduled(objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime);
                }

                var NewListData = mailScheduled.Select(x => new
                {
                    x.TemplateName,
                    x.MailCampaignName,
                    x.GroupName,
                    x.Subject,
                    x.ScheduledDate
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                Helper.SaveDataSetToExcel(dataSet, MainPath);
                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
