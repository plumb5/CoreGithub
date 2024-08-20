using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class NotificationRulesController : BaseController
    {
        public NotificationRulesController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/NotificationRules/

        public IActionResult Index()
        {
            return View("NotificationRules");
        }

        [HttpPost]
        public async Task<JsonResult> GetNotificationRulesMaxCount([FromBody] NotificationRules_GetNotificationRulesMaxCount commonDetails)
        {
            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AdsId, SQLProvider))
            {
                return Json(await objRule.GetMaxCount(commonDetails.rulesName));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetNotificationRules([FromBody] NotificationRules_GetNotificationRules commonDetails)
        {
            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AdsId, SQLProvider))
            {
                return Json(await objRule.GetRulesForBinding(commonDetails.OffSet, commonDetails.FetchNext, commonDetails.rulesName));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveContactNotificationRule([FromBody] NotificationRules_SaveContactNotificationRule commonDetails)
        {
            Int32 Id = 0;

            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AccountId, SQLProvider))
            {
                int MailId = 0;
                if (commonDetails.mailSendingSetting.MailTemplateId > 0)
                {
                    commonDetails.mailSendingSetting.ScheduledDate = DateTime.Now;
                    using (var objDLMail = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.AccountId, SQLProvider))
                        MailId = await objDLMail.Save(commonDetails.mailSendingSetting);
                }


                int SmsId = 0;
                if (commonDetails.smsSendingSetting.SmsTemplateId > 0)
                {
                    commonDetails.smsSendingSetting.ScheduledDate = DateTime.Now;
                    commonDetails.smsSendingSetting.ScheduleBatchType = "SINGLE";
                    using (var objSms = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.AccountId, SQLProvider))
                        SmsId = await objSms.Save(commonDetails.smsSendingSetting);
                }

                int WaId = 0;
                if (commonDetails.whatsAppSendingSetting.WhatsAppTemplateId > 0)
                {
                    commonDetails.whatsAppSendingSetting.ScheduledDate = DateTime.Now;
                    using (var objSms = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(commonDetails.AccountId, SQLProvider))
                        WaId = await objSms.Save(commonDetails.whatsAppSendingSetting);
                }

                commonDetails.contactNotificationrule.AutoMailSendingSettingId = MailId > 0 ? MailId : 0;
                commonDetails.contactNotificationrule.AutoSmsSendingSettingId = SmsId > 0 ? SmsId : 0;
                commonDetails.contactNotificationrule.AutoWhatsAppSendingSettingId = WaId > 0 ? WaId : 0;

                if (commonDetails.contactNotificationrule.Id > 0)
                {
                    bool reusult = await objRule.UpdateContactNotificationRule(commonDetails.contactNotificationrule);
                    if (reusult)
                    {
                        Id = commonDetails.contactNotificationrule.Id;
                    }
                    else
                    {
                        Id = 0;
                    }
                }
                else
                {
                    Id = await objRule.SaveContactNotificationRule(commonDetails.contactNotificationrule);
                }
            }

            return Json(Id);
        }

        [HttpPost]
        public async Task<JsonResult> GetRules([FromBody] NotificationRules_GetRules commonDetails)
        {
            List<ContactNotificationRule> ContactNotificationRule = null;
            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AccountId, SQLProvider))
            {
                ContactNotificationRule = await objRule.GetRules();
            }
            return Json(ContactNotificationRule);
        }

        [HttpPost]
        public async Task<JsonResult> GetRulesForEdit([FromBody] NotificationRules_GetRulesForEdit commonDetails)
        {
            List<ContactNotificationRule> ContactNotificationRule = null;
            MailSendingSetting? mailSendingSetting = null;
            SmsSendingSetting? smsSendingSetting = null;
            WhatsAppSendingSetting? wasendingsetting = null;
            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AccountId, SQLProvider))
            {
                ContactNotificationRule = await objRule.GetRuleNotification(commonDetails.RuleId);
            }

            if (ContactNotificationRule != null && ContactNotificationRule.Count > 0)
            {
                if (ContactNotificationRule[0].AutoMailSendingSettingId > 0)
                {
                    using (var objMail = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.AccountId, SQLProvider))
                    {
                        mailSendingSetting = await objMail.GetDetail(ContactNotificationRule[0].AutoMailSendingSettingId);
                    }
                }

                if (ContactNotificationRule[0].AutoSmsSendingSettingId > 0)
                {
                    using (var objSMS = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.AccountId, SQLProvider))
                    {
                        smsSendingSetting = await objSMS.Get(ContactNotificationRule[0].AutoSmsSendingSettingId);
                    }
                }

                if (ContactNotificationRule[0].AutoWhatsAppSendingSettingId > 0)
                {
                    using (var objWA = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(commonDetails.AccountId, SQLProvider))
                    {
                        wasendingsetting = await objWA.Get(ContactNotificationRule[0].AutoWhatsAppSendingSettingId);
                    }
                }
            }

            return Json(new { ContactNotificationRule, mailSendingSetting, smsSendingSetting, wasendingsetting });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] NotificationRules_Delete commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AdsId, SQLProvider))
            {
                bool result;
                result = await objRule.DeleteLeadNotificationToSales(commonDetails.Id);

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToggleStatus([FromBody] NotificationRules_ToggleStatus commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AdsId, SQLProvider))
            {
                bool result;
                result = await objRule.ToogleStatus(commonDetails.Id, commonDetails.Status);

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangePriority([FromBody] NotificationRules_ChangePriority commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (commonDetails.contactNotificationRules != null && commonDetails.contactNotificationRules.Count() > 0)
            {
                for (int i = 0; i < commonDetails.contactNotificationRules.Count(); i++)
                {
                    using (var objRule = DLContactNotificationRule.GetDLContactNotificationRule(commonDetails.AdsId, SQLProvider))
                    {
                        bool result;
                        result = await objRule.ChangePriority(commonDetails.contactNotificationRules[i].Id, commonDetails.contactNotificationRules[i].RulePriority);
                    }
                }
            }
            return Json(true);
        }

        [HttpPost]
        public async Task<IActionResult> GetLMSGroupList([FromBody] NotificationRules_GetLMSGroupList commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(commonDetails.accountId, SQLProvider))
            {
                return Json(await objGroup.GetLMSGroupList());
            }
        }
    }
}
