using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/Settings/

        public IActionResult Index()
        {
            return View("Settings");
        }

        public IActionResult AlertNotification()
        {
            return View("AlertNotification");
        }

        [HttpPost]
        public async Task<JsonResult> GetStageScore([FromBody] SettingsDto_GetStageScore commonDetails)
        {
            List<LmsStage> lmsStageList = new List<LmsStage>();
            List<LmsStageNotification> lmsStageNotificationList = new List<LmsStageNotification>();
            using (var objStage = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
            {
                lmsStageList = await objStage.GetAllList();
            }
            using (var objLms = DLLmsStageNotification.GetDLLmsStageNotification(commonDetails.AccountId, SQLProvider))
            {

                lmsStageNotificationList = await objLms.GET();
            }
            return Json(new { LmsStageList = lmsStageList, LmsNotificationList = lmsStageNotificationList });
        }

        [HttpPost]
        public async Task<JsonResult> GetLMSStageNotification([FromBody] SettingsDto_GetStageScore commonDetails)
        {
            using (var objLms = DLLmsStageNotification.GetDLLmsStageNotification(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objLms.GET());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteStage([FromBody] SettingsDto_DeleteStage commonDetails)
        {
            using (var objLmsDelete = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
            {
                bool result = await objLmsDelete.Delete(commonDetails.lmsStageId);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetUser([FromBody] SettingsDto_GetUser commonDetails)
        {

            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchyList = await objUser.GetHisUsers(commonDetails.UserId, commonDetails.AccountId);
                userHierarchyList.Add(await objUser.GetHisDetails(commonDetails.UserId));
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }

        [HttpPost]
        public async Task<JsonResult> GetUserGroups([FromBody] SettingsDto_GetStageScore commonDetails)
        {
            List<UserGroup> userGroupList = new List<UserGroup>();
            Account? account = new Account();
            using (var objAccount = DLAccount.GetDLAccount(SQLProvider))
            {
                account = await objAccount.GetAccountDetails(commonDetails.AccountId);
            }

            using (var objDLUser = DLUserGroup.GetDLUserGroup(SQLProvider))
            {
                userGroupList = await objDLUser.GetUserGroup(account.UserInfoUserId);
            }

            return Json(userGroupList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateUpdateStageDetails([FromBody] SettingsDto_SaveOrUpdateUpdateStageDetails commonDetails)
        {
            int resultId = 0;
            bool status = false;
            if (commonDetails.lmsStage.Id == 0)
            {
                using (var objLmsStage = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
                {
                    resultId = await objLmsStage.Save(commonDetails.lmsStage);
                }

                if (resultId > 0)
                {
                    commonDetails.lmsStageNotification.LmsStageId = Convert.ToInt16(resultId);
                    using (var objLmsStageNotification = DLLmsStageNotification.GetDLLmsStageNotification(commonDetails.AccountId, SQLProvider))
                    {
                        await objLmsStageNotification.Save(commonDetails.lmsStageNotification);
                    }
                }
            }
            else
            {
                using (var objLmsStage = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
                {
                    status = await objLmsStage.Update(commonDetails.lmsStage);
                }

                if (status)
                {
                    using (var objLmsStageNotification = DLLmsStageNotification.GetDLLmsStageNotification(commonDetails.AccountId, SQLProvider))
                    {
                        await objLmsStageNotification.Save(commonDetails.lmsStageNotification);
                    }
                }
            }
            return Json(new { resultId, status });
        }

        [HttpPost]
        public async Task<JsonResult> GetWhatsAppTemplateList([FromBody] SettingsDto_GetWhatsAppTemplateList commonDetails)
        {
            using (var objBL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.GetTemplateDetails(new WhatsAppTemplates()));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMailTemplateList([FromBody] SettingsDto_GetWhatsAppTemplateList commonDetails)
        {
            MailTemplate template = new MailTemplate();
            List<MailTemplate> mailTemplateList = null;
            List<string> fields = new List<string>() { "Id", "Name", "MailCampaignId", "SubjectLine" };
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                mailTemplateList = await objDL.GET(template, 0, 0, null, fields);
                return Json(mailTemplateList);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetSmsTemplateList([FromBody] SettingsDto_GetWhatsAppTemplateList commonDetails)
        {
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetTemplateDetails(new SmsTemplate()));
            }
        }
    }
}
