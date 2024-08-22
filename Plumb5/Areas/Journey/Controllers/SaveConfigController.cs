using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class SaveConfigController : BaseController
    {
        public SaveConfigController(IConfiguration _configuration) : base(_configuration)
        { }
        private int Id = 0;
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveMailConfig([FromBody] SaveConfig_SaveMailConfigDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var obj = DLWorkFlowMail.GetDLWorkFlowMail(details.accountId, SQLProvider))
            {
                if (details.MailConfig.ConfigureMailId > 0)
                {
                    await obj.Update(details.MailConfig); Id = details.MailConfig.ConfigureMailId;
                }
                else { Id = await obj.Save(details.MailConfig); }
            }
            return Json(Id);
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveSmsConfig([FromBody] SaveConfig_SaveSmsConfigDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var obj = DLWorkFlowSMS.GetDLWorkFlowSMS(details.accountId, SQLProvider))
            {
                if (details.SmsConfig.ConfigureSmsId > 0)
                {
                    await obj.Update(details.SmsConfig); Id = details.SmsConfig.ConfigureSmsId;

                }
                else { Id = await obj.Save(details.SmsConfig); }
            }
            return Json(Id);
        }

        public async Task<ActionResult> GetRuleDetails([FromBody] SaveConfig_GetRuleDetailsDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var obj = DLWorkFlowRule.GetDLWorkFlowRule(details.accountId, SQLProvider))
            {
                var ds =await obj.GetAllRule();
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString());
            }
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveWebPushConfig([FromBody] SaveConfig_SaveWebPushConfigDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obj = DLWorkFlowWebPush.GetDLWorkFlowWebPush(details.accountId, SQLProvider))
            {
                if (details.WebPushConfig.ConfigureWebPushId > 0) {await obj.Update(details.WebPushConfig); Id = details.WebPushConfig.ConfigureWebPushId; }
                else { Id = await obj.Save(details.WebPushConfig); }
            }
            return Json(Id);
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveAppPushConfig([FromBody] SaveConfig_SaveAppPushConfigDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obj = DLWorkFlowMobile.GetDLWorkFlowMobile(details.accountId, SQLProvider))
            {
                if (details.AppPushConfig.ConfigureMobileId > 0) { await obj.Update(details.AppPushConfig); Id = details.AppPushConfig.ConfigureMobileId; }
                else { Id = await obj.Save(details.AppPushConfig); }
            }
            return Json(Id);
        }


        [HttpPost]
        [Log]
        public async Task<JsonResult> UpdateDate([FromBody] SaveConfig_UpdateDateDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
            ObjMl.UserName = user.UserName;
            ObjMl.WorkFlowId = details.WorkflowId;
            var objDL = DLWorkFlow.GetDLWorkFlow(details.accountId, SQLProvider);
            await objDL.UpdateLastupdateddata(ObjMl);
            return null;
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveWebHookConfigDetails([FromBody] SaveConfig_SaveWebHookConfigDetailsDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obj = DLWorkFlowWebHook.GetDLWorkFlowWebHook(details.accountId, SQLProvider))
            {
                if (details.webhookConfig.ConfigureWebHookId > 0)
                {
                    await obj.Update(details.webhookConfig); Id = details.webhookConfig.ConfigureWebHookId;
                }
                else
                {
                    Id = await obj.Save(details.webhookConfig);
                }
            }
            return Json(Id);
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveWhatsappConfig([FromBody] SaveConfig_SaveWhatsappConfigDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obj = DLWorkFlowWhatsApp.GetDLWorkFlowWhatsApp(details.accountId, SQLProvider))
            {
                if (details.WhatsappConfig.ConfigureWhatsAppId > 0) { await obj.UpdateAsync(details.WhatsappConfig); Id = details.WhatsappConfig.ConfigureWhatsAppId; }
                else { Id = await obj.SaveAsync(details.WhatsappConfig); }
            }
            return Json(Id);
        }
    }
}
