using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class DndHoursController : BaseController
    {
        public DndHoursController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Preference/DndHours/

        public IActionResult Index()
        {
            return View("DndHours");
        }
        [HttpPost]
        public async Task<JsonResult> SaveDndHour([FromBody] DndHoursDto_SaveDndHourDto DndHoursDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "DndHoursController", "Preferrence", "SaveDndHour", Helper.GetIP(), JsonConvert.SerializeObject(new { DndHour = dndHour, startHour = startHour, startMinutes = startMinutes, endHour = endHour, endMinutes = endMinutes }));
            //#endregion

            bool Mail = false;
            bool Sms = false;

            MailConfiguration mailConfiguration = new MailConfiguration() { IsTimeRestriction = DndHoursDto.dndHour.IsTimeRestriction, WeekDays = DndHoursDto.dndHour.WeekDays, WeekDayStartTime = null, WeekDayEndTime = null, Saturday = DndHoursDto.dndHour.Saturday, SaturdayStartTime = null, Sunday = DndHoursDto.dndHour.Sunday, SundayStartTime = null, SundayEndTime = null };
            SmsConfiguration smsConfiguration = new SmsConfiguration() { IsTimeRestriction = DndHoursDto.dndHour.IsTimeRestriction, WeekDays = DndHoursDto.dndHour.WeekDays, WeekDayStartTime = null, WeekDayEndTime = null, Saturday = DndHoursDto.dndHour.Saturday, SaturdayStartTime = null, Sunday = DndHoursDto.dndHour.Sunday, SundayStartTime = null, SundayEndTime = null };
            mailConfiguration.WeekDayStartTime = null;
            smsConfiguration.WeekDayStartTime = null;

            mailConfiguration.WeekDayEndTime = null;
            smsConfiguration.WeekDayEndTime = null;

            mailConfiguration.SaturdayStartTime = null;
            smsConfiguration.SaturdayStartTime = null;

            mailConfiguration.SaturdayEndTime = null;
            smsConfiguration.SaturdayEndTime = null;


            mailConfiguration.SundayStartTime = null;
            smsConfiguration.SundayStartTime = null;

            mailConfiguration.SundayEndTime = null;
            smsConfiguration.SundayEndTime = null;

            if (DndHoursDto.dndHour.WeekDays == true)
            {
                mailConfiguration.WeekDayStartTime = new TimeSpan(DndHoursDto.startHour, DndHoursDto.startMinutes, 0);
                smsConfiguration.WeekDayStartTime = mailConfiguration.WeekDayStartTime;

                mailConfiguration.WeekDayEndTime = new TimeSpan(DndHoursDto.endHour, DndHoursDto.endMinutes, 0);
                smsConfiguration.WeekDayEndTime = mailConfiguration.WeekDayEndTime;
            }
            else if (DndHoursDto.dndHour.Saturday == true)
            {
                mailConfiguration.SaturdayStartTime = new TimeSpan(DndHoursDto.startHour, DndHoursDto.startMinutes, 0);
                smsConfiguration.SaturdayStartTime = mailConfiguration.SaturdayStartTime;

                mailConfiguration.SaturdayEndTime = new TimeSpan(DndHoursDto.endHour, DndHoursDto.endMinutes, 0);
                smsConfiguration.SaturdayEndTime = mailConfiguration.SaturdayEndTime;
            }
            else if (DndHoursDto.dndHour.Sunday == true)
            {
                mailConfiguration.SundayStartTime = new TimeSpan(DndHoursDto.startHour, DndHoursDto.startMinutes, 0);
                smsConfiguration.SundayStartTime = mailConfiguration.SundayStartTime;

                mailConfiguration.SundayEndTime = new TimeSpan(DndHoursDto.endHour, DndHoursDto.endMinutes, 0);
                smsConfiguration.SundayEndTime = mailConfiguration.SundayEndTime;
            }
            else
            {
                mailConfiguration.WeekDayStartTime = null;
                smsConfiguration.WeekDayStartTime = null;

                mailConfiguration.WeekDayEndTime = null;
                smsConfiguration.WeekDayEndTime = null;

                mailConfiguration.SaturdayStartTime = null;
                smsConfiguration.SaturdayStartTime = null;

                mailConfiguration.SaturdayEndTime = null;
                smsConfiguration.SaturdayEndTime = null;


                mailConfiguration.SundayStartTime = null;
                smsConfiguration.SundayStartTime = null;

                mailConfiguration.SundayEndTime = null;
                smsConfiguration.SundayEndTime = null;
            }

            using (var objDL =   DLMailConfiguration.GetDLMailConfiguration(DndHoursDto.AccountId,SQLProvider))
            {
                Mail =await objDL.UpdateGovernanceConfiguration(mailConfiguration);
            }


            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(DndHoursDto.AccountId, SQLProvider))
            {
                Sms = await objDL.UpdateGovernanceConfiguration(smsConfiguration);
            }

            //if (Mail || Sms)
            //    LogMessage = "Saved successfully";
            //else
            //    LogMessage = "Unable to save";

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Mail = Mail, Sms = Sms }), LogMessage);
            return Json(new { Mail = Mail, Sms = Sms } );
        }
        [HttpPost]
        public async Task<JsonResult> GetDndHourDetails([FromBody] DndHoursDto_GetDndHourDetailsDto DndHoursDto)
        {
            dynamic configuartion = null;
            List<MailConfiguration> mailConfiguration = new List<MailConfiguration>();
            using (var objDL =   DLMailConfiguration.GetDLMailConfiguration(DndHoursDto.AccountId, SQLProvider))
            {
                mailConfiguration = await objDL.GetDetails(new MailConfiguration());
            }

            List<SmsConfiguration> smsConfiguration = new List<SmsConfiguration>();
            using (var objDL =   DLSmsConfiguration.GetDLSmsConfiguration(DndHoursDto.AccountId,SQLProvider))
            {
                smsConfiguration = await objDL.GetSmsConfigurationDetails(new SmsConfiguration());
            }

            if (mailConfiguration != null && mailConfiguration.Count > 0)
            {
                configuartion = (from mail in mailConfiguration
                                 select new
                                 {
                                     WeekDays = mail.WeekDays,
                                     Saturday = mail.Saturday,
                                     Sunday = mail.Sunday,
                                     startHour = mail.WeekDayStartTime != null ? ((TimeSpan)mail.WeekDayStartTime).Hours : mail.SaturdayStartTime != null ? ((TimeSpan)mail.SaturdayStartTime).Hours : (mail.SundayStartTime != null ? ((TimeSpan)mail.SundayStartTime).Hours : 0),
                                     startMinutes = mail.WeekDayStartTime != null ? ((TimeSpan)mail.WeekDayStartTime).Minutes : mail.SaturdayStartTime != null ? ((TimeSpan)mail.SaturdayStartTime).Minutes : (mail.SundayStartTime != null ? ((TimeSpan)mail.SundayStartTime).Minutes : 0),
                                     endHour = mail.WeekDayEndTime != null ? ((TimeSpan)mail.WeekDayEndTime).Hours : mail.SaturdayEndTime != null ? ((TimeSpan)mail.SaturdayEndTime).Hours : (mail.SundayEndTime != null ? ((TimeSpan)mail.SundayEndTime).Hours : 0),
                                     endMinutes = mail.WeekDayEndTime != null ? ((TimeSpan)mail.WeekDayEndTime).Minutes : mail.SaturdayEndTime != null ? ((TimeSpan)mail.SaturdayEndTime).Minutes : (mail.SundayEndTime != null ? ((TimeSpan)mail.SundayEndTime).Minutes : 0),
                                 }).ToList()[0];
            }
            else if (smsConfiguration != null && smsConfiguration.Count > 0)
            {
                configuartion = (from sms in smsConfiguration
                                 select new
                                 {
                                     WeekDays = sms.WeekDays,
                                     Saturday = sms.Saturday,
                                     Sunday = sms.Sunday,
                                     startHour = sms.WeekDayStartTime != null ? ((TimeSpan)sms.WeekDayStartTime).Hours : sms.SaturdayStartTime != null ? ((TimeSpan)sms.SaturdayStartTime).Hours : (sms.SundayStartTime != null ? ((TimeSpan)sms.SundayStartTime).Hours : 0),
                                     startMinutes = sms.WeekDayStartTime != null ? ((TimeSpan)sms.WeekDayStartTime).Minutes : sms.SaturdayStartTime != null ? ((TimeSpan)sms.SaturdayStartTime).Minutes : (sms.SundayStartTime != null ? ((TimeSpan)sms.SundayStartTime).Minutes : 0),
                                     endHour = sms.WeekDayEndTime != null ? ((TimeSpan)sms.WeekDayEndTime).Hours : sms.SaturdayEndTime != null ? ((TimeSpan)sms.SaturdayEndTime).Hours : (sms.SundayEndTime != null ? ((TimeSpan)sms.SundayEndTime).Hours : 0),
                                     endMinutes = sms.WeekDayEndTime != null ? ((TimeSpan)sms.WeekDayEndTime).Minutes : sms.SaturdayEndTime != null ? ((TimeSpan)sms.SaturdayEndTime).Minutes : (sms.SundayEndTime != null ? ((TimeSpan)sms.SundayEndTime).Minutes : 0),
                                 }).ToList()[0];
            }


            return Json(configuartion );
        }
    }
}
