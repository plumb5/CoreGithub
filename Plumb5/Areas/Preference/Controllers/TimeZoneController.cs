using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class TimeZoneController : BaseController
    {
        public TimeZoneController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("TimeZone");
        }
        [HttpPost]
        public async Task<ActionResult> SaveTimeZone([FromBody] TimeZone_SaveTimeZoneDto objDto)
        {
            LoginInfo? Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "TimeZoneController", "Preference", "SaveTimeZone", Helper.GetIP(), JsonConvert.SerializeObject(new { TimeZoneName = TimeZoneName }));
            //#endregion
            int Id = 0;
            using (var timeZone = DLAccountTimeZone.GetDLAccountTimeZone(objDto.AccountId, SQLProvider))
            {
                Id =await timeZone.Save(objDto.TimeZoneName, objDto.AccountId, objDto.TimeZoneTitle);
                //if (Id > 0)
                //    LogMessage = "Saved successfully";
                //else
                //    LogMessage = "Unable to save";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Id = Id }), LogMessage);
            return Json(Id);
        }
        [HttpPost]
        public async Task<ActionResult> GetTimeZone([FromBody] TimeZone_GetTimeZoneDto objDto)
        {
            AccountTimeZone accountTimeZone = null;
            using (var timeZone = DLAccountTimeZone.GetDLAccountTimeZone(objDto.AccountId, SQLProvider))
            {
                accountTimeZone =await timeZone.GET();
            }
            return Json(accountTimeZone);
        }
    }
}
