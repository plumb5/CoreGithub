using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageContact.Models;
using Plumb5.Controllers;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ApiImportSettingsController : BaseController
    {
        public ApiImportSettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /ManageContact/ApiImportSettings/

        public ActionResult Index()
        {
            return View("ApiImportSettings");
        }

        [HttpPost]
        public async Task<IActionResult> MaxCount([FromBody] ApiImportSettings_MaxCount commonDetails)
        {
            int returnVal;
            using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objBL.MaxCount(commonDetails.Name);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetDetails([FromBody] ApiImportSettings_GetDetails commonDetails)
        {
            List<ApiImportResponseSetting> ftpImportSettingsdetails = null;
            using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.accountId, SQLProvider))
            {
                ftpImportSettingsdetails = (await objBL.Get(commonDetails.FetchNext, commonDetails.OffSet, commonDetails.Name)).ToList();
            }

            return Json(ftpImportSettingsdetails);
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] ApiImportSettings_SaveOrUpdateDetails commonDetails)
        {
            bool Status = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int SmsSendingSettingId = 0;
            string jsonString = "";
            try
            {
                if (commonDetails.mailSendingSetting != null && commonDetails.mailSendingSetting.Count() > 0)
                {
                    using (var objBLSave = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.accountId, SQLProvider))
                    {
                        for (int i = 0; i < commonDetails.mailSendingSetting.Count(); i++)
                        {
                            MailSendingSetting mailsending = new MailSendingSetting();
                            mailsending.ScheduledStatus = commonDetails.mailSendingSetting[i].ScheduledStatus;
                            mailsending.ReplyTo = commonDetails.mailSendingSetting[i].FromEmailId;
                            mailsending.UserInfoUserId = commonDetails.mailSendingSetting[i].UserInfoUserId;
                            mailsending.MailTemplateId = commonDetails.mailSendingSetting[i].MailTemplateId;
                            mailsending.Subject = commonDetails.mailSendingSetting[i].Subject;
                            mailsending.FromName = commonDetails.mailSendingSetting[i].FromName;
                            mailsending.FromEmailId = commonDetails.mailSendingSetting[i].FromEmailId;
                            mailsending.ReplyTo = commonDetails.mailSendingSetting[i].ReplyTo;
                            mailsending.Name = "API Import Response Campaign Identifier - " + DateTime.Now.ToString("ddMMyyyyHHmmssfff"); ;
                            mailsending.Id = commonDetails.mailSendingSetting[i].Id;
                            if (commonDetails.mailSendingSetting[i].Id > 0)
                            {
                                commonDetails.MailOutResponderList[i].SendingSettingId = commonDetails.mailSendingSetting[i].Id.ToString();
                                bool Result = await objBLSave.Update(mailsending);
                            }
                            else
                                commonDetails.MailOutResponderList[i].SendingSettingId = (await objBLSave.Save(mailsending)).ToString(); ;
                        }
                    }

                    if (commonDetails.IsMailConditional)
                    {
                        if (commonDetails.MailOutResponderList != null && commonDetails.MailOutResponderList.Count() > 0)
                            jsonString = JsonConvert.SerializeObject(commonDetails.MailOutResponderList);
                        commonDetails.apiImportResponseSetting.MailSendingConditonalJson = jsonString;
                    }

                    else
                        commonDetails.apiImportResponseSetting.MailSendingSettingId = Convert.ToInt32(commonDetails.MailOutResponderList[0].SendingSettingId);
                }

                if (commonDetails.smsSendingSetting != null && commonDetails.smsSendingSetting.Count() > 0)
                {
                    jsonString = "";
                    using (var objBLSave = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
                    {
                        for (int i = 0; i < commonDetails.smsSendingSetting.Count(); i++)
                        {

                            SmsSendingSetting smssending = new SmsSendingSetting();
                            smssending.Name = "API Import Response Campaign Identifier - " + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                            smssending.SmsTemplateId = commonDetails.smsSendingSetting[i].SmsTemplateId;
                            smssending.UserInfoUserId = commonDetails.smsSendingSetting[i].UserInfoUserId;
                            smssending.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                            smssending.Id = commonDetails.smsSendingSetting[i].Id;
                            if (commonDetails.smsSendingSetting[i].Id > 0)
                            {
                                commonDetails.SmsOutResponderList[i].SendingSettingId = commonDetails.smsSendingSetting[i].Id.ToString();
                                bool Result = await objBLSave.Update(smssending);
                            }
                            else
                                commonDetails.SmsOutResponderList[i].SendingSettingId = (await objBLSave.Save(smssending)).ToString();
                        }
                    }

                    if (commonDetails.IsSmsconditional)
                    {
                        if (commonDetails.SmsOutResponderList != null && commonDetails.SmsOutResponderList.Count() > 0)
                            jsonString = JsonConvert.SerializeObject(commonDetails.SmsOutResponderList);
                        commonDetails.apiImportResponseSetting.SmsSendingConditonalJson = jsonString;
                    }
                    else
                    {
                        commonDetails.apiImportResponseSetting.SmsSendingSettingId = Convert.ToInt32(commonDetails.SmsOutResponderList[0].SendingSettingId);
                    }
                }

                if (commonDetails.whatsappSendingSetting != null && commonDetails.whatsappSendingSetting.Count() > 0)
                {
                    jsonString = "";
                    using (var objBLSave = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(commonDetails.accountId, SQLProvider))
                    {
                        for (int i = 0; i < commonDetails.whatsappSendingSetting.Count(); i++)
                        {

                            WhatsAppSendingSetting whatsappsending = new WhatsAppSendingSetting();
                            whatsappsending.Name = "API Import Response Campaign Identifier - " + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                            whatsappsending.WhatsAppTemplateId = commonDetails.whatsappSendingSetting[i].WhatsAppTemplateId;
                            whatsappsending.UserInfoUserId = commonDetails.whatsappSendingSetting[i].UserInfoUserId;
                            whatsappsending.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                            whatsappsending.Id = commonDetails.whatsappSendingSetting[i].Id;
                            if (commonDetails.whatsappSendingSetting[i].Id > 0)
                            {
                                commonDetails.WhatsappOutResponderList[i].SendingSettingId = commonDetails.whatsappSendingSetting[i].Id.ToString();
                                bool Result = await objBLSave.Update(whatsappsending);
                            }
                            else
                                commonDetails.WhatsappOutResponderList[i].SendingSettingId = (await objBLSave.Save(whatsappsending)).ToString();
                        }
                    }

                    if (commonDetails.Iswhatsappconditional)
                    {
                        if (commonDetails.WhatsappOutResponderList != null && commonDetails.WhatsappOutResponderList.Count() > 0)
                            jsonString = JsonConvert.SerializeObject(commonDetails.WhatsappOutResponderList);
                        commonDetails.apiImportResponseSetting.WhatsAppSendingConditonalJson = jsonString;
                    }
                    else
                        commonDetails.apiImportResponseSetting.WhatsAppSendingSettingId = Convert.ToInt32(commonDetails.WhatsappOutResponderList[0].SendingSettingId);
                }

                using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.accountId, SQLProvider))
                {
                    if (await objBL.Save(commonDetails.apiImportResponseSetting) == true)
                        Status = true;
                }
            }
            catch (Exception ex)
            {
                Status = false;
            }
            return Json(Status);
        }

        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ApiImportSettings_Delete commonDetails)
        {
            using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.Delete(commonDetails.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> ToggleStatus([FromBody] ApiImportSettings_ToggleStatus commonDetails)
        {
            using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.ToggleStatus(commonDetails.Id, commonDetails.Status));
            }
        }

        [HttpPost]
        public async Task<JsonResult> SaveMailSendingSetting([FromBody] ApiImportSettings_SaveMailSendingSetting commonDetails)
        {
            string jsonString = "";
            if (commonDetails.mailSendingSetting != null)
            {
                using (var objBLSave = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.accountId, SQLProvider))
                {
                    for (int i = 0; i < commonDetails.mailSendingSetting.Count(); i++)
                    {
                        MailSendingSetting mailsending = new MailSendingSetting();
                        mailsending.ScheduledStatus = commonDetails.mailSendingSetting[i].ScheduledStatus;
                        mailsending.ReplyTo = commonDetails.mailSendingSetting[i].FromEmailId;
                        mailsending.UserInfoUserId = commonDetails.mailSendingSetting[i].UserInfoUserId;
                        mailsending.MailTemplateId = commonDetails.mailSendingSetting[i].MailTemplateId;
                        mailsending.Subject = commonDetails.mailSendingSetting[i].Subject;
                        mailsending.FromName = commonDetails.mailSendingSetting[i].FromName;
                        mailsending.FromEmailId = commonDetails.mailSendingSetting[i].FromEmailId;
                        mailsending.ReplyTo = commonDetails.mailSendingSetting[i].ReplyTo;
                        mailsending.Name = commonDetails.mailSendingSetting[i].Name;
                        commonDetails.MailOutResponderList[i].SendingSettingId = (await objBLSave.Save(mailsending)).ToString();
                    }
                }

                if (commonDetails.MailOutResponderList != null && commonDetails.MailOutResponderList.Count() > 0)
                    jsonString = JsonConvert.SerializeObject(commonDetails.MailOutResponderList);
            }
            return Json(jsonString);
        }

        [HttpPost]
        public async Task<JsonResult> SaveSMSSendingSetting([FromBody] ApiImportSettings_SaveSMSSendingSetting commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int SmsSendingSettingId = 0;

            commonDetails.smsSendingSetting.Name = "API Import Response Campaign Identifier - " + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            commonDetails.smsSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            using (var objBLSave = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                SmsSendingSettingId = await objBLSave.Save(commonDetails.smsSendingSetting);
            }
            return Json(SmsSendingSettingId);
        }

        [HttpPost]
        public async Task<JsonResult> SaveWASendingSetting([FromBody] ApiImportSettings_SaveWASendingSetting commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int WASendingSettingId = 0;

            commonDetails.waSendingSetting.Name = "API Import Response Campaign Identifier - " + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            commonDetails.waSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            using (var objBLSave = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(commonDetails.accountId, SQLProvider))
            {
                WASendingSettingId = await objBLSave.Save(commonDetails.waSendingSetting);
            }
            return Json(WASendingSettingId);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailSendingSettingDetail([FromBody] ApiImportSettings_GetMailSendingSettingDetail commonDetails)
        {
            using (var objDAL = DLMailSendingSetting.GetDLMailSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDAL.GetDetailsForEdit(commonDetails.MailSendingSettingId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetSMSSendingSettingDetail([FromBody] ApiImportSettings_GetSMSSendingSettingDetail commonDetails)
        {
            using (var objDAL = DLSmsSendingSetting.GetDLSmsSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDAL.GetListforapi(commonDetails.SmsSendingSettingId));

            }
        }

        [HttpPost]
        public async Task<JsonResult> GetWASendingSettingDetail([FromBody] ApiImportSettings_GetWASendingSettingDetail commonDetails)
        {
            using (var objDAL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDAL.GetListforapi(commonDetails.WASendingSettingId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetWebhookDetail([FromBody] ApiImportSettings_GetWebhookDetail commonDetails)
        {
            WebHookDetails? webHookDetails;
            using (var objDAL = DLWebHookDetails.GetDLWebHookDetails(commonDetails.accountId, SQLProvider))
            {
                webHookDetails = await objDAL.GetWebHookDetails(commonDetails.WebhookId);
            }
            return Json(webHookDetails);
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateWebhook([FromBody] ApiImportSettings_SaveOrUpdateWebhook commonDetails)
        {
            try
            {
                int IsSavedOrUpdated = 0;
                using (var objDAL = DLWebHookDetails.GetDLWebHookDetails(commonDetails.accountId, SQLProvider))
                {
                    if (commonDetails.webHookDetails.WebHookId > 0)
                    {
                        if (await objDAL.Update(commonDetails.webHookDetails))
                            IsSavedOrUpdated = 0;
                        else
                            IsSavedOrUpdated = -2;
                    }
                    else { commonDetails.webHookDetails.WebHookId = IsSavedOrUpdated = await objDAL.Save(commonDetails.webHookDetails); }
                }
                return Json(new { IsSavedOrUpdated = IsSavedOrUpdated, Result = true, WebhookDetails = commonDetails.webHookDetails });
            }
            catch { return Json(new { IsSavedOrUpdated = -1, Result = false, WebhookDetails = commonDetails.webHookDetails }); }
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCountAPILogs([FromBody] ApiImportSettings_GetMaxCountAPILogs commonDetails)
        {
            int returnVal;
            using (var objBL = DLApiImportResponseSettingLogs.GetDLApiImportResponseSettingLogs(commonDetails.AdsId, SQLProvider))
            {
                returnVal = await objBL.MaxCount(commonDetails.ApiImportResponseSettingId);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<JsonResult> GetDetailsAPILogs([FromBody] ApiImportSettings_GetDetailsAPILogs commonDetails)
        {
            List<ApiImportResponseSettingLogs> apilogsTracker = new List<ApiImportResponseSettingLogs>();
            using (var obBL = DLApiImportResponseSettingLogs.GetDLApiImportResponseSettingLogs(commonDetails.AdsId, SQLProvider))
            {
                apilogsTracker = (await obBL.GetDetails(commonDetails.ApiImportResponseSettingId, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
                return Json(apilogsTracker);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetUser([FromBody] ApiImportSettings_GetUser commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();

            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchyList = await objUser.GetHisUsers(user.UserId, commonDetails.accountId);
                userHierarchyList.Add(await objUser.GetHisDetails(user.UserId));
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }

        [HttpPost]
        public async Task<IActionResult> GetLMSGroupList([FromBody] ApiImportSettings_GetUser commonDetails)
        {
            using (var objGroup = DLLmsGroup.GetDLLmsGroup(commonDetails.accountId, SQLProvider))
            {
                return Json(await objGroup.GetLMSGroupList());
            }
        }
    }
}
