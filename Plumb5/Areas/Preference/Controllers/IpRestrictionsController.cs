using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;
using Plumb5.Dto;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class IpRestrictionsController : BaseController
    {
        public IpRestrictionsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("IpRestrictions");
        }
        [HttpPost]
        public async Task<JsonResult> GetAccounts()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<Account> accountList = null;
            using (var objAccount = DLAccount.GetDLAccount(SQLProvider))
            {
                accountList =await objAccount.GetDetails(user.UserId);
            }
            return Json(accountList);
        }
        [HttpPost]
        public async Task<JsonResult> GetRestrictions([FromBody] IpRestrictions_GetRestrictionsDto objDto)
        {
            IpRestrictions Restrictions = null;
            using (var objDL = DLIpRestrictions.GetDLIpRestrictions(objDto.AccountId, SQLProvider))
            {
                Restrictions =await objDL.GetIpRestrictions();
            }
            return Json(Restrictions);
        }
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateRestrictions([FromBody] IpRestrictions_SaveOrUpdateRestrictionsDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "Template", "IpRestrictions", "SaveOrUpdateIpRestrictions", Helper.GetIP(), JsonConvert.SerializeObject(new { IpRestrictions = IpRestrictions }));
            //#endregion

            var result = 0;
            using (var objDL = DLIpRestrictions.GetDLIpRestrictions(objDto.AccountId, SQLProvider))
            {
                result =await objDL.SaveAndUpdate(objDto.IpRestrictions);
            }


            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
            return Json(result);
        }
    }
}
