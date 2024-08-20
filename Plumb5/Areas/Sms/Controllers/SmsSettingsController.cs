using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using Plumb5.Areas.Sms.Models;
using Newtonsoft.Json;
using Plumb5.Areas.Sms.Dto;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SmsSettingsController : BaseController
    {
        public SmsSettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("SmsSettings");
        }
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdate([FromBody] SmsSettings_SaveOrUpdateDto objDto)
        {
            SmsConfiguration[] smsConfiguration = objDto.smsConfigurationData;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
           
            //#region Logs       
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Configuration", "Sms", "SaveOrUpdate", Helper.GetIP(), JsonConvert.SerializeObject(new { smsConfiguration = smsConfiguration }));
            //#endregion

            MLSmsConfiguration smsConfigurationDetails = null;
            int[] Ids = new int[2];

            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                //objDL.TruncateSmsDetails();

                for (int i = 0; i < smsConfiguration.Length; i++)
                {
                    if (smsConfiguration[i].ProviderName.ToLower() == "tmarc" || smsConfiguration[i].ProviderName.ToLower() == "digispice" || smsConfiguration[i].ProviderName.ToLower() == "valuefirst")
                    {
                        if (!smsConfiguration[i].IsPromotionalOrTransactionalType)
                            if (smsConfiguration[i].ApiKey == Convert.ToString(TempData["SmsMaskedPromotionalApiKey"]))
                                smsConfiguration[i].ApiKey = TempData["PromotionalApiKey"].ToString();

                        if (smsConfiguration[i].IsPromotionalOrTransactionalType)
                            if (smsConfiguration[i].ApiKey == Convert.ToString(TempData["SmsMaskedTransactionalApiKey"]))
                                smsConfiguration[i].ApiKey = TempData["TransactionalApiKey"].ToString();
                    }
                    else
                    {
                        if (!smsConfiguration[i].IsPromotionalOrTransactionalType)
                            if (smsConfiguration[i].Password == Convert.ToString(TempData["SmsMaskedPromotionalApiKey"]))
                                smsConfiguration[i].Password = TempData["PromotionalApiKey"].ToString();

                        if (smsConfiguration[i].IsPromotionalOrTransactionalType)
                            if (smsConfiguration[i].Password == Convert.ToString(TempData["SmsMaskedTransactionalApiKey"]))
                                smsConfiguration[i].Password = TempData["TransactionalApiKey"].ToString();

                    }

                    smsConfiguration[i].UserInfoUserId = user.UserId;
                    if (objDto.SmsConfigurationNameID == 0)
                        Ids[i] =await objDL.Save(smsConfiguration[i], objDto.ConfigurationName);
                    else
                        Ids[i] =await objDL.Update(smsConfiguration[i], objDto.ConfigurationName);
                }

                //for (int j = 0; j < Ids.Length; j++)
                //{
                //    if (Ids[j] > 0)
                //    {
                //        LogMessage = "Sms configuration settings has been created";
                //    }
                //    else
                //    {
                //        LogMessage = "Unable to create a sms configuraton settings ";
                //    }
                //}

                //smsConfigurationDetails = objDL.GetConfigurationDetails();
                //if (smsConfigurationDetails != null)
                //{
                //    Session["PromotionalApiKey"] = smsConfigurationDetails.PromotionalAPIKey;
                //    Session["TransactionalApiKey"] = smsConfigurationDetails.TransactionalAPIKey;

                //   // smsConfigurationDetails = GeneralConfigurationSetting.EncrptSmsDetails(smsConfigurationDetails);
                //}
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { smsConfiguration = smsConfigurationDetails, CallBakUrl = AllConfigURLDetails.KeyValueForConfig["SMSDELIVRD"] }), LogMessage);
            return Json(new { smsConfiguration = smsConfigurationDetails, CallBakUrl = AllConfigURLDetails.KeyValueForConfig["SMSDELIVRD"] });
        }
        [HttpPost]
        public async Task<JsonResult> GetSmsConfigurationDetails([FromBody] SmsSettings_GetSmsConfigurationDetailsDto objDto)
        {

            List<MLSmsConfiguration> smsConfigurationDetails = null;
            using (var objBL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                smsConfigurationDetails =await objBL.GetConfigurationDetails();
                int cnt = 0;

            }

            return Json(smsConfigurationDetails);
        }
        [HttpPost]
        public async Task<JsonResult> ShowApiKeys([FromBody] SmsSettings_ShowApiKeysDto objDto)
        {
            if (objDto.IsPromtionalTransactionsl)
                return Json(Convert.ToString(HttpContext.Session.GetString("TransactionalApiKey")));
            else
                return Json(Convert.ToString(HttpContext.Session.GetString("PromotionalApiKey")));
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteVendorDetails([FromBody] SmsSettings_DeleteVendorDetailsDto objDto)
        {
            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                await objDL.TruncateSmsDetails();
                return Json(true);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetSmsConfigurations([FromBody] SmsSettings_GetSmsConfigurationsDto objDto)
        {
            List<SmsConfiguration> smsConfiguration = null;
            using (var objBL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                smsConfiguration =await objBL.GetSmsConfigurationDetails(new SmsConfiguration { SmsConfigurationNameId = objDto.smsConfigurationNameID });
                int cnt = 0;
                for (int i = 0; i < smsConfiguration.Count; i++)
                {
                    if (smsConfiguration != null)
                    {
                        if (smsConfiguration[i].IsPromotionalOrTransactionalType == false)
                        {

                            if (smsConfiguration[i].ProviderName.ToLower() == "tmarc" || smsConfiguration[i].ProviderName.ToLower() == "digispice" || smsConfiguration[i].ProviderName.ToLower() == "valuefirst")
                            {
                                TempData["PromotionalApiKey"] = smsConfiguration[i].ApiKey;
                                cnt = smsConfiguration[i].ApiKey.Length;
                                smsConfiguration[i].ApiKey = smsConfiguration[i].ApiKey.Substring(cnt).PadLeft(cnt, '*');
                                TempData["SmsMaskedPromotionalApiKey"] = smsConfiguration[i].ApiKey;
                            }
                            else
                            {
                                TempData["PromotionalApiKey"] = smsConfiguration[i].Password;
                                cnt = smsConfiguration[i].Password.Length;
                                smsConfiguration[i].Password = smsConfiguration[i].Password.Substring(cnt).PadLeft(cnt, '*');
                                TempData["SmsMaskedPromotionalApiKey"] = smsConfiguration[i].Password;
                            }


                        }
                        if (smsConfiguration[i].IsPromotionalOrTransactionalType == true)
                        {

                            if (smsConfiguration[i].ProviderName.ToLower() == "tmarc" || smsConfiguration[i].ProviderName.ToLower() == "digispice" || smsConfiguration[i].ProviderName.ToLower() == "valuefirst")
                            {
                                TempData["TransactionalApiKey"] = smsConfiguration[i].ApiKey;
                                cnt = smsConfiguration[i].ApiKey.Length;
                                smsConfiguration[i].ApiKey = smsConfiguration[i].ApiKey.Substring(cnt).PadLeft(cnt, '*');
                                TempData["SmsMaskedTransactionalApiKey"] = smsConfiguration[i].ApiKey;
                            }
                            else
                            {
                                TempData["TransactionalApiKey"] = smsConfiguration[i].Password;
                                cnt = smsConfiguration[i].Password.Length;
                                smsConfiguration[i].Password = smsConfiguration[i].Password.Substring(cnt).PadLeft(cnt, '*');
                                TempData["SmsMaskedTransactionalApiKey"] = smsConfiguration[i].Password;
                            }

                        }
                    }


                }
                return Json(smsConfiguration);
            }
        }
        [HttpPost]
        public async Task<JsonResult> CheckSmsSettingConfigured([FromBody] SmsSettings_CheckSmsSettingConfiguredDto objDto)
        {
            List<SmsConfiguration> smsConfiguration = null;
            bool result = false;
            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                smsConfiguration =await objDL.GetSmsConfigurationDetails(new SmsConfiguration { });

                if (smsConfiguration != null && smsConfiguration.Count > 0)
                    result = true;
                else
                    result = false;

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ValidateSettings([FromBody] SmsSettings_ValidateSettingsDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            UserInfo userInfo = null;
            string PhoneNumber = string.Empty;
            SmsConfiguration smsConfigurationTransaction = new SmsConfiguration();
            SmsConfiguration smsConfigurationPromotional = new SmsConfiguration();

            smsConfigurationTransaction.SmsConfigurationNameId = objDto.smsConfigurationNameId;
            smsConfigurationPromotional.SmsConfigurationNameId = objDto.smsConfigurationNameId;
            List<SentResponses> sentResponses = new List<SentResponses>();

            using (var userInfoBL = DLUserInfo.GetDLUserInfo(SQLProvider))
                userInfo =await userInfoBL.GetDetail(user.UserId);

            if (userInfo != null && !String.IsNullOrEmpty(userInfo.MobilePhone))
                PhoneNumber = userInfo.MobilePhone;
            else
                PhoneNumber = "9995555512";

            using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
                smsConfigurationTransaction =await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);

            SmsNotificationTemplate smsNotificationTemplate;


            if (smsConfigurationTransaction != null)
            {
                SentResponses sentResponses1 = new SentResponses();
                sentResponses1.IsPromotionalTransactional = true;

                #region DLT Notification SMS
                using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.accountId,SQLProvider))
                {
                    smsNotificationTemplate =await obj.GetByIdentifier("smstransactionaltest");
                }

                #endregion DLT Notification SMS

                //string MessageContent = "Hi Please ingore, Testing sms from transactional channel";
                string MessageContent = smsNotificationTemplate.MessageContent;
                if (smsNotificationTemplate.IsSmsNotificationEnabled)
                {
                    using (SendIndividualSms sendSms = new SendIndividualSms(objDto.accountId))
                        sentResponses1 =await sendSms.ValidateSmsSettingss(smsConfigurationTransaction, MessageContent, PhoneNumber, smsNotificationTemplate.IsSmsNotificationEnabled, smsNotificationTemplate.VendorTemplateId,SQLProvider);
                    sentResponses.Add(sentResponses1);
                }
            }
            else
            {
                sentResponses[0].IsPromotionalTransactional = true;
                sentResponses[0].SentStatus = false;
                sentResponses[0].Message = "You have not configured for transactional";
            }

            using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
                smsConfigurationPromotional =await objDLSMSConfig.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);

            if (smsConfigurationPromotional != null)
            {
                #region DLT Notification SMS
                using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.accountId,SQLProvider))
                {
                    smsNotificationTemplate =await obj.GetByIdentifier("smspromotionaltest");
                }

                #endregion DLT Notification SMS
                SentResponses sentResponses2 = new SentResponses();
                //string MessageContent = "Hi Please ingore, Testing sms from promotional channel";
                string MessageContent = smsNotificationTemplate.MessageContent;
                if (smsNotificationTemplate.IsSmsNotificationEnabled)
                {
                    using (SendIndividualSms sendSms = new SendIndividualSms(objDto.accountId))
                        sentResponses2 =await sendSms.ValidateSmsSettingss(smsConfigurationPromotional, MessageContent, PhoneNumber, smsNotificationTemplate.IsSmsNotificationEnabled, smsNotificationTemplate.VendorTemplateId,SQLProvider);
                    sentResponses.Add(sentResponses2);
                }
            }
            else
            {
                sentResponses[1].IsPromotionalTransactional = false;
                sentResponses[1].SentStatus = false;
                sentResponses[1].Message = "You have not configured for promotional";
            }

            return Json(sentResponses);
        }
        [HttpPost]
        public async Task<JsonResult> GetConfiguredDeliveryURL()
        {
            var GeneralConfigurationSetting = new GeneralSmsConfigurationSetting();
            return Json(GeneralConfigurationSetting);
        }
        [HttpPost]
        public async Task<JsonResult> GetDltOperatorList()
        {
            using (var objDL = DLSmsDLTConfiguration.GetDLSmsDLTConfiguration(SQLProvider))
            {
                return Json(await objDL.GetList());
            }
        }
        [HttpPost]
        public async Task<JsonResult> ArchiveVendorDetails([FromBody] SmsSettings_ArchiveVendorDetailsDto objDto)
        {
            bool result = false;
            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId,SQLProvider))
            {
                result =await objDL.ArchiveVendorDetails(objDto.smsConfigurationNameId);
            }
            return Json(result);
        }
        [HttpPost]
        public async Task<JsonResult> GetConfigurationNames([FromBody] SmsSettings_GetConfigurationNamesDto objDto)
        {
            using (var objBL = DLSmsConfigurationName.GetDLSmsConfigurationName(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetConfigurationNames());
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetConfigurationNameList([FromBody] SmsSettings_GetConfigurationNameListDto objDto)
        {
            using (var objBL = DLSmsConfigurationName.GetDLSmsConfigurationName(objDto.accountId, SQLProvider))
            {
                return Json(await objBL.GetConfigurationNameList());
            }
        }
    }
}
