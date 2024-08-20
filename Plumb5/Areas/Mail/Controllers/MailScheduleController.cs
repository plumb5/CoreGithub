using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailScheduleController : BaseController
    {
        public MailScheduleController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Mail/MailSchedule/

        public IActionResult Index()
        {
            return View("MailSchedule");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveScheduleDetails([FromBody] MailSchedule_SaveScheduleDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int MailSendingSettingId = 0;

            foreach (var mailSendingSetting in commonDetails.mailSendingSettingList)
            {
                mailSendingSetting.UserInfoUserId = user.UserId;
                mailSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                using (var objDLSave = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.accountId, SQLProvider))
                {
                    MailSendingSetting currentMailSendingSetting = new MailSendingSetting();
                    Helper.CopyWithDateTimeWhenString(mailSendingSetting, currentMailSendingSetting);
                    if (mailSendingSetting.Id > 0)
                    {
                        bool Result = await objDLSave.Update(currentMailSendingSetting);
                        if (Result)
                        {
                            MailSendingSettingId = mailSendingSetting.Id;
                        }
                    }
                    else
                    {
                        MailSendingSettingId = await objDLSave.Save(currentMailSendingSetting);
                    }
                }
            }
            return Json(MailSendingSettingId);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailScheduleDetails([FromBody] MailSchedule_GetMailScheduleDetails commonDetails)
        {
            using (var objDrips = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDrips.GetDetailsForEdit(commonDetails.MailSendingSettingId));
            }
        }

        [HttpPost]
        public async Task<IActionResult> ShowSegmentAnalysis([FromBody] MailSchedule_ShowSegmentAnalysis commonDetails)
        {
            using (var objDL = DLMailSent.GetDLMailSent(commonDetails.accountId, SQLProvider))
            {
                var openClickRate = await objDL.GetOpenAndClickedRate(commonDetails.GroupIds);
                var getdata = JsonConvert.SerializeObject(openClickRate, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetActiveEmailIds([FromBody] MailSchedule_GetActiveEmailIds commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<string> ListOfFromEmailds = new List<string>();
            FromEmailIdConfig fromemailConfig = new FromEmailIdConfig(commonDetails.accountId, SQLProvider);

            List<MailConfigForSending> listOfEmailIds = await fromemailConfig.GetActiveEmails();

            ListOfFromEmailds = (from p in listOfEmailIds
                                 where p.FromEmailId == user.EmailId || p.ShowFromEmailIdBasedOnUserLogin == true
                                 select p.FromEmailId).ToList();
            return Json(ListOfFromEmailds);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCredits([FromBody] MailSchedule_CheckCredits commonDetails)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                UserInfoUserId = (await objDL.GetAccountDetails(commonDetails.accountId)).UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                using (var objDL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData = await objDL.GetDailyConsumptionedDetails(commonDetails.accountId, UserInfoUserId);
                    getCredits = PurchaseData.TotalMailRemaining;
                    result = getCredits >= commonDetails.TotalContacts ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits });
        }
    }
}
