using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class SchedulesController : BaseController
    {
        public SchedulesController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Schedules");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Schedules_GetMaxCountDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            using (var objDL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(FromDateTime, ToDateTime, details.CampignName));
            }
        }

        public async Task<JsonResult> ShowSetSchedule([FromBody] Schedules_ShowSetScheduleDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<string> fieldsName = new List<string>() { "MailSendingSettingId", "MailCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "ScheduledStatus", "IsMailSplit", "GroupName", "ScheduledCompletedDate", "StoppedReason" };

            MLMailScheduled schdule_Obj = new MLMailScheduled();
            schdule_Obj.MailCampaignName = details.CampignName;
            ArrayList data = new ArrayList() { schdule_Obj };
            HttpContext.Session.SetString("MailSchedules", JsonConvert.SerializeObject(data));

            using (var objDL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetScheduled(details.OffSet, details.FetchNext, FromDateTime, ToDateTime, fieldsName, details.CampignName));
            }
        }

        [Log]
        public async Task<JsonResult> Delete([FromBody] Schedules_DeleteDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs   
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "TriggerDashboard", "Mail", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion

            using (var objDL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.Delete(details.Id);
                //if (result)
                //    LogMessage = "The scheduled has been deleted";
                //else
                //    LogMessage = "Unable to delete scheduled";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Schedules_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                MLMailScheduled schdule_Obj = new MLMailScheduled();
                if (HttpContext.Session.GetString("MailSchedules") != null)
                {
                    ArrayList? schData = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailSchedules"));
                    schdule_Obj = JsonConvert.DeserializeObject<MLMailScheduled>(schData[0].ToString());
                }

                List<MLMailScheduled> campaignDetails = null;
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                DateTime FrmDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                List<string> fieldsName = new List<string>() { "MailSendingSettingId", "MailCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "GroupName", "ScheduledCompletedDate" };

                ArrayList data = new ArrayList() { details.FromDateTime, ToDateTime };
                HttpContext.Session.SetString("MailSchedules", JsonConvert.SerializeObject(data));

                using (var objDL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId, SQLProvider))
                {
                    campaignDetails = await objDL.GetScheduled(details.OffSet, details.FetchNext, FrmDateTime, ToDateTime, fieldsName, schdule_Obj.MailCampaignName);
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var NewListData = campaignDetails.Select(x => new
                {
                    x.MailCampaignName,
                    x.CampaignDescription,
                    GroupName = x.GroupName == null ? "NA" : x.GroupName,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledCompletedDate)).ToString(),
                    ScheduledDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate)).ToString()
                });

                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "Schedule_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        public async Task<JsonResult> UpdateScheduledDrip([FromBody] Schedules_UpdateScheduledDripDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDLMailSchedule = DLMailDrips.GetDLMailDrips(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDLMailSchedule.UpdateDripDetails(details.mailDrips);
                return Json(result);
            }
        }
    }
}
