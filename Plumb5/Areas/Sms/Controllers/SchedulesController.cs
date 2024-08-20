using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SchedulesController : BaseController
    {
        public SchedulesController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("Schedules");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] SchedulesDto_GetMaxCount commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            using (var objDL = DLSmsScheduledReport.GetDLSmsScheduledReport(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(FromDateTime, ToDateTime, commonDetails.CampignName));
            }
        }

        [HttpPost]
        public async Task<JsonResult> ShowSetSchedule([FromBody] SchedulesDto_ShowSetSchedule commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<string> fieldsName = new List<string>() { "SmsSendingSettingId", "SmsCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "ScheduledStatus", "ScheduleBatchType", "GroupName", "StoppedReason" };
            List<MLSmsScheduled> mLSmsScheduleds = null;
            MLSmsScheduled schdule_Obj = new MLSmsScheduled();
            schdule_Obj.SmsCampaignName = commonDetails.CampignName;
            ArrayList data = new ArrayList() { schdule_Obj };
            HttpContext.Session.SetString("SmsSchedules", JsonConvert.SerializeObject(data));

            using (var objDL = DLSmsScheduledReport.GetDLSmsScheduledReport(domainDetails.AdsId, SQLProvider))
            {
                mLSmsScheduleds = (await objDL.GetScheduled(commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime, fieldsName, commonDetails.CampignName)).ToList();
                return Json(mLSmsScheduleds);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportScheduleCampaign([FromBody] SchedulesDto_ExportScheduleCampaign commonDetails)
        {
            List<MLSmsScheduled> campaignDetails = null;
            MLSmsScheduled schdule_Obj = new MLSmsScheduled();
            List<string> fieldsName = new List<string>() { "SmsSendingSettingId", "SmsCampaignName", "CampaignDescription", "UpdatedDate", "ScheduledDate", "ScheduleBatchType", "GroupName" };
            ArrayList? schData = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsSchedules"));
            schdule_Obj = JsonConvert.DeserializeObject<MLSmsScheduled>(schData[0].ToString());

            DateTime FrmDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


            using (var objDL = DLSmsScheduledReport.GetDLSmsScheduledReport(commonDetails.AccountId, SQLProvider))
            {
                campaignDetails = (await objDL.GetScheduled(commonDetails.OffSet, commonDetails.FetchNext, FrmDateTime, ToDateTime, fieldsName, schdule_Obj.SmsCampaignName)).ToList();
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
            var NewListData = campaignDetails.Select(x => new
            {
                Name = x.SmsCampaignName,
                Description = x.CampaignDescription,
                GroupName = x.GroupName != null ? x.GroupName : "NA",
                UpdatedOn = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate.ToString())).ToString(),
                ScheduledFor = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate.ToString())).ToString()
            });

            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "SmsSchedule_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateScheduledDrip([FromBody] MailDrips mailDrips)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


            using (var objDLMailSchedule = DLMailDrips.GetDLMailDrips(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDLMailSchedule.UpdateDripDetails(mailDrips);
                return Json(result);
            }
        }

        //public JsonResult UpdateSchedule(MailScheduled mailScheduled)
        //{
        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];
        //    #region Logs     
        //    string LogMessage = string.Empty;
        //    Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedules", "Mail", "UpdateSchedule", Helper.GetIP(), JsonConvert.SerializeObject(new { mailScheduled = mailScheduled }));
        //    #endregion
        //    using (BLMailScheduled objDL = new BLMailScheduled(domainDetails.AdsId))
        //    {
        //        bool result = objDL.UpdateScheduledDate(mailScheduled);
        //        if (result)
        //            LogMessage = "The mail campaign schedule has been updated";
        //        else
        //            LogMessage = "Unable to update mail campaign schedule";

        //        TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
        //        return Json(result, );
        //    }
        //}
        //public JsonResult UpdateScheduledMails(int MailTemplateId, string Subject, MailScheduled mailScheduled)
        //{
        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];
        //    #region Logs  
        //    string LogMessage = string.Empty;
        //    Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedules", "Mail", "UpdateScheduledMails", Helper.GetIP(), JsonConvert.SerializeObject(new { mailScheduled = mailScheduled, MailTemplateId = MailTemplateId, Subject = Subject }));
        //    #endregion

        //    MailSendingSetting mailSendingSetting = new MailSendingSetting() { };
        //    DLMailSendingSetting objMailSendingSetting = new DLMailSendingSetting(domainDetails.AdsId);
        //    mailSendingSetting = objMailSendingSetting.GetDetail(mailScheduled.MailSendingSettingId);
        //    bool status = false;
        //    if (mailSendingSetting != null && mailSendingSetting.Id > 0)
        //    {
        //        mailSendingSetting.MailTemplateId = MailTemplateId;
        //        mailSendingSetting.Subject = Subject;

        //        if (objMailSendingSetting.Update(mailSendingSetting))
        //        {
        //            using (BLMailScheduled objMailSchedule = new BLMailScheduled(domainDetails.AdsId))
        //            {
        //                mailScheduled.ScheduledStatus = 1;
        //                status = objMailSchedule.UpdateScheduledDate(mailScheduled);
        //                if (status)
        //                    LogMessage = "The mail schedule has been updated";
        //                else
        //                    LogMessage = "Unable to schedule a campaign";
        //            }
        //        }
        //    }
        //    TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = status }), LogMessage);
        //    return Json(status, );
        //}

        //public JsonResult DeleteSetSchedule(int Id, int IsDrip)
        //{
        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];
        //    #region Logs   
        //    string LogMessage = string.Empty;
        //    Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedules", "Mail", "DeleteSetSchedule", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id, IsDrip = IsDrip }));
        //    #endregion
        //    if (IsDrip == 0)
        //    {
        //        using (BLMailScheduled objMailSchedule = new BLMailScheduled(domainDetails.AdsId))
        //        {
        //            bool result = objMailSchedule.Delete(Id);
        //            if (result)
        //                LogMessage = "The mail schedule has been deleted";
        //            else
        //                LogMessage = "Unable to delete a mail schedule";
        //        }
        //        TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, Message = "Deleted successfully" }), LogMessage);
        //        return Json(new { Status = true, Message = "Deleted successfully" }, );
        //    }
        //    else if (IsDrip == 1)
        //    {
        //        using (DLMailDrips objMailDrip = new DLMailDrips(domainDetails.AdsId))
        //        {
        //            bool result = objMailDrip.Delete(Id);
        //            if (result)
        //                LogMessage = "The mail schedule drip has been deleted";
        //            else
        //                LogMessage = "Unable to delete mail schedule drip";
        //        }
        //        TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, Message = "Deleted successfully" }), LogMessage);
        //        return Json(new { Status = true, Message = "Deleted successfully" }, );
        //    }
        //    TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = "Problem in deleting" }), LogMessage);
        //    return Json(new { Status = false, Message = "Problem in deleting" }, );
        //}

        //public JsonResult GetSchedule(int MailSendingSettingId)
        //{
        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
        //    bool status = false;
        //    //MailScheduled mailScheduled = new MailScheduled() { MailSendingSettingId = MailSendingSettingId, ScheduledDate = DateTime.Now, ScheduledStatus = 0};
        //    MailScheduled mailScheduled = new MailScheduled() { MailSendingSettingId = MailSendingSettingId };

        //    using (BLMailScheduled objMailSchedule = new BLMailScheduled(domainDetails.AdsId))
        //    {
        //        mailScheduled = objMailSchedule.Get(mailScheduled);
        //        if (mailScheduled != null)
        //            status = true;
        //    }
        //    return Json(new { Status = status, MailScheduled = mailScheduled }, );
        //}

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] SchedulesDto_Export commonDetails)
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
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailSchedules"));
                    FromDateTime = Convert.ToDateTime(data[0]);
                    ToDateTime = Convert.ToDateTime(data[1]);
                }

                using (var objDL = DLMailScheduledReport.GetDLMailScheduledReport(domainDetails.AdsId, SQLProvider))
                {
                    mailScheduled = await objDL.GetScheduled(commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime);
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

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

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
