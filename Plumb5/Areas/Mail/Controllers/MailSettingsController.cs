using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Areas.Mail.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Text;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailSettingsController : BaseController
    {
        public MailSettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Mail/MailSetting/

        public ActionResult Index()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.DomainName = domainDetails.DomainName;
            return View("MailSettings");
        }

        [HttpPost]
        public async Task<JsonResult> GetFromEmailIdToBind([FromBody] MailSettings_GetFromEmailIdToBindDto commonDetails)
        {
            List<MailConfigForSending> listOfEmailIds = null;

            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
            {
                listOfEmailIds = await objDL.GetFromEmailIdToBind();
            }
            return Json(listOfEmailIds);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Save([FromBody] MailSettings_SaveDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool SentStatus = false; string Message = String.Empty;
            if (commonDetails.verifyfromEmailId.Id == 0)
            {
                using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
                    commonDetails.verifyfromEmailId.Id = await objDL.Save(commonDetails.verifyfromEmailId);
            }

            if (commonDetails.verifyfromEmailId.Id > 0)
            {
                StringBuilder Body = new StringBuilder();
                try
                {
                    System.IO.StreamReader myFile = new System.IO.StreamReader(AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\MailToUserToActivateFromEmailId.html");
                    Body.Append(myFile.ReadToEnd());
                    myFile.Close();

                    if (Helper.IsValidEmailAddress(commonDetails.verifyfromEmailId.FromEmailId))
                    {
                        MailConfiguration? mailconfiguration = new MailConfiguration();
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
                            mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);

                        if (mailconfiguration != null && mailconfiguration.Id > 0 && mailconfiguration.IsPromotionalOrTransactionalType == true)
                        {
                            MailSetting mailSetting = new MailSetting()
                            {
                                Forward = false,
                                FromEmailId = string.Empty,
                                FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString(),
                                MailTemplateId = 0,
                                ReplyTo = string.Empty,
                                Subject = "Sender Mail Id Verfication",
                                Subscribe = true,
                                MessageBodyText = String.Empty,
                                IsTransaction = true
                            };

                            MailConfigForSending? mailConfigForSending = null;
                            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
                                mailConfigForSending = await objDL.GetActiveFromEmailId();

                            if (mailConfigForSending != null && !String.IsNullOrEmpty(mailConfigForSending.FromEmailId))
                            {
                                mailSetting.FromEmailId = mailConfigForSending.FromEmailId;
                                mailSetting.ReplyTo = mailConfigForSending.FromEmailId;
                            }
                            else
                            {
                                mailSetting.FromEmailId = user.EmailId;
                                mailSetting.ReplyTo = user.EmailId;
                            }

                            string toName = "";
                            if (commonDetails.verifyfromEmailId.FromEmailId.Contains("@"))
                            {
                                int lenMail = commonDetails.verifyfromEmailId.FromEmailId.IndexOf("@", StringComparison.Ordinal);
                                toName = commonDetails.verifyfromEmailId.FromEmailId.Substring(0, lenMail);
                            }
                            string encrytAdsId = Helper.Base64Encode(commonDetails.accountId.ToString());
                            string onlinePath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "Authentication/VerifySenderEmailId?AdsId=" + encrytAdsId + "&Id=" + commonDetails.verifyfromEmailId.Id + "";

                            Body.Replace("<!--UserName-->", toName).Replace("<!--Link-->", onlinePath).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                            mailSetting.MessageBodyText = Body.ToString();

                            MLMailSent mailSent = new MLMailSent()
                            {
                                MailCampaignId = 0,
                                MailSendingSettingId = 0,
                                GroupId = 0,
                                ContactId = 0,
                                EmailId = commonDetails.verifyfromEmailId.FromEmailId,
                                P5MailUniqueID = Guid.NewGuid().ToString()
                            };

                            MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                            {
                                ConfigurationId = 0,
                                GroupId = 0
                            };

                            IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(commonDetails.accountId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "Mail");
                            SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                            if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                            {
                                List<MLMailVendorResponse> responses = MailGeneralBaseFactory.VendorResponses;
                                MailSent responseMailSent = new MailSent()
                                {
                                    FromEmailId = mailSetting.FromEmailId,
                                    FromName = mailSetting.FromName,
                                    MailTemplateId = mailSetting.MailTemplateId,
                                    Subject = mailSetting.Subject,
                                    MailCampaignId = responses[0].MailCampaignId,
                                    MailSendingSettingId = responses[0].MailSendingSettingId,
                                    GroupId = responses[0].GroupId,
                                    ContactId = responses[0].ContactId,
                                    EmailId = responses[0].EmailId,
                                    P5MailUniqueID = responses[0].P5MailUniqueID,
                                    CampaignJobName = responses[0].CampaignJobName,
                                    ErrorMessage = responses[0].ErrorMessage,
                                    ProductIds = responses[0].ProductIds,
                                    ResponseId = responses[0].ResponseId,
                                    SendStatus = (byte)responses[0].SendStatus,
                                    WorkFlowDataId = responses[0].WorkFlowDataId,
                                    WorkFlowId = responses[0].WorkFlowId,
                                    SentDate = DateTime.Now,
                                    ReplayToEmailId = mailSetting.ReplyTo,
                                    TriggerMailSmsId = 0,
                                    MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                };

                                using (var objDL = DLMailSent.GetDLMailSent(commonDetails.accountId, SQLProvider))
                                {
                                    await objDL.Send(responseMailSent);
                                }
                                if (SentStatus)
                                {
                                    SentStatus = true;
                                    Message = "Added successfully! Activation mail has been sent.";
                                }
                                else
                                {
                                    SentStatus = false;
                                    Message = "Added successfully! Activation mail is not sent, contact support";
                                }
                            }
                            else
                            {
                                SentStatus = false;
                                Message = "Added successfully! Activation mail is not sent, contact support";
                            }
                        }
                        else
                        {
                            SentStatus = false;
                            Message = "Transactional settings has not been configured";
                        }
                    }
                    else
                    {
                        SentStatus = false;
                        Message = "Invalid email id address";
                    }
                }
                catch (Exception ex)
                {
                    SentStatus = false;
                    Message = ex.Message.ToString();
                }
            }
            else
            {
                SentStatus = false;
                Message = "Email id already exists, try with another";
            }

            return Json(new { commonDetails.verifyfromEmailId, SentStatus, Message });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangeEditableStatus([FromBody] MailSettings_ChangeEditableStatusDto commonDetails)
        {

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "VerifyFromEmailId", "Mail", "ChangeEditableStatus", Helper.GetIP(), JsonConvert.SerializeObject(new { verifyfromEmailId = verifyfromEmailId }));
            //#endregion
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
            {
                bool result = await objDL.ChangeEditableStatus(commonDetails.verifyfromEmailId);
                //if (result)
                //    LogMessage = "The verified email id status has been changed";
                //else
                //    LogMessage = "Unable to change verified email id status ";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), "");
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] MailSettings_DeleteDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
            {
                bool result = await objDL.Delete(commonDetails.Id);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetServiceProviderlDetails([FromBody] MailSettings_GetServiceProviderlDetailsDto commonDetails)
        {
            List<MLMailConfiguration> mailConfigurationDetails = null;

            using (var objBL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objBL.GetAllServiceProviderlDetails();

            }
            return Json(mailConfigurationDetails);

        }

        [HttpPost]
        public async Task<JsonResult> ServiceProviderlDetails([FromBody] MailSettings_ServiceProviderlDetailsDto commonDetails)
        {
            List<MailConfiguration> mailConfigurationDetails = null;

            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetServiceProviderlDetails(commonDetails.mailConfigurationNameID);
                mailConfigurationDetails = mailConfigurationDetails.Where(a => a.ActiveStatus == true).ToList();
                string apikey = "";
                int cnt = 0;
                for (int i = 0; i < mailConfigurationDetails.Count; i++)
                {
                    apikey = mailConfigurationDetails[i].ApiKey;
                    cnt = mailConfigurationDetails[i].ApiKey.Length;
                    if (mailConfigurationDetails[i].IsPromotionalOrTransactionalType == false)
                    {
                        //Session["MailPromotionalApiKey"] = apikey;
                        TempData["MailPromotionalApiKey"] = apikey;
                        mailConfigurationDetails[i].ApiKey = mailConfigurationDetails[i].ApiKey.Substring(cnt).PadLeft(mailConfigurationDetails[i].ApiKey.Length, '*');
                        TempData["MailMaskedPromotionalApiKey"] = mailConfigurationDetails[i].ApiKey;
                    }
                    else
                    {
                        // Session["MailTransactionalApiKey"] = apikey;
                        TempData["MailTransactionalApiKey"] = apikey;
                        mailConfigurationDetails[i].ApiKey = mailConfigurationDetails[i].ApiKey.Substring(cnt).PadLeft(mailConfigurationDetails[i].ApiKey.Length, '*');
                        TempData["MailMaskedTransactionalApiKey"] = mailConfigurationDetails[i].ApiKey;
                    }

                    // cnt = apikey.Length <= 5 ? apikey.Length - 1 : apikey.Length - 5;
                    // mailConfigurationDetails[i].ApiKey = apikey.Substring(cnt).PadLeft(apikey.Length, '*');
                }
            }
            return Json(new { mailConfigurationDetails = mailConfigurationDetails });

        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdate([FromBody] MailSettings_SaveOrUpdate commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool result = false;

            commonDetails.ServiceProvicerData.UserInfoUserId = user.UserId;
            if (commonDetails.ServiceProvicerData.Id <= 0)
            {
                using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
                    commonDetails.ServiceProvicerData.Id = await objDL.Save(commonDetails.ServiceProvicerData, commonDetails.ConfigurationName);
                if (commonDetails.ServiceProvicerData.Id > 0)
                    result = true;
                else
                    result = false;
            }
            else if (commonDetails.ServiceProvicerData.Id > 0)
            {

                //Checking Promotional API Key if not changed then assigning Promotional Api Key stored in Session
                if (!commonDetails.ServiceProvicerData.IsPromotionalOrTransactionalType)
                    if (commonDetails.ServiceProvicerData.ApiKey == Convert.ToString(TempData["MailMaskedPromotionalApiKey"]))
                        commonDetails.ServiceProvicerData.ApiKey = TempData["MailPromotionalApiKey"].ToString();
                //Checking Transactional API Key if not changed then assigning Promotional Api Key stored in Session
                if (commonDetails.ServiceProvicerData.IsPromotionalOrTransactionalType)
                    if (commonDetails.ServiceProvicerData.ApiKey == Convert.ToString(TempData["MailMaskedTransactionalApiKey"]))
                        commonDetails.ServiceProvicerData.ApiKey = TempData["MailTransactionalApiKey"].ToString();

                using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
                {
                    result = await objDL.Update(commonDetails.ServiceProvicerData, commonDetails.ConfigurationName);
                }
            }


            if (commonDetails.ServiceProvicerData.ProviderName.ToLower() == "elastic mail")
            {
                MLMailAutheintication mLMailAutheintication = new MLMailAutheintication();
                if (commonDetails.ServiceProvicerData.AccountName.IndexOf("@") > -1)
                    mLMailAutheintication.Domain = commonDetails.ServiceProvicerData.AccountName.Substring(commonDetails.ServiceProvicerData.AccountName.IndexOf("@") + 1);
                else
                    mLMailAutheintication.Domain = commonDetails.ServiceProvicerData.AccountName;

                using (var bLMailAutheintication = DLMailAutheintication.GetMailAutheintication(commonDetails.accountId, SQLProvider))
                    await bLMailAutheintication.UPDATE(mLMailAutheintication);
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { mailConfiguration = ServiceProvicerData }), LogMessage);
            return Json(new { commonDetails.ServiceProvicerData, result });
        }

        [HttpPost]
        public async Task<JsonResult> GetDetailsByProviderName([FromBody] MailSettings_GetDetailsByProviderName commonDetails)
        {
            List<MailConfiguration> mailConfigurationDetails = null;
            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetDetailsByProviderName(commonDetails.ProviderName);
            }
            for (int i = 0; i < mailConfigurationDetails.Count; i++)
            {
                if (!String.IsNullOrEmpty(mailConfigurationDetails[i].ApiKey))
                {
                    mailConfigurationDetails[i].ApiKey = "********************";
                }
            }
            return Json(new { mailConfigurationDetails = mailConfigurationDetails });

        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteServiceProvider([FromBody] MailSettings_GetDetailsByProviderName commonDetails)
        {

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs   
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "ServiceProvider", "MailSetting", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { ProviderName = ProviderName }));
            //#endregion

            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                bool result = await objDL.DeleteServiceProvider(commonDetails.ProviderName);
                //if (result)
                //    LogMessage = "The service provider has been deleted";
                //else
                //    LogMessage = "Unable to delete service provider";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [HttpPost]
        public JsonResult BindApiKey([FromBody] MailSettings_BindApiKey commonDetails)
        {
            List<MailConfiguration> apilist = new List<MailConfiguration>();
            apilist = JsonConvert.DeserializeObject<List<MailConfiguration>>(HttpContext.Session.GetString("ApiKeyDetails"));
            string? ApiKey;
            if (commonDetails.ProviderType == "Promotional")
                ApiKey = HttpContext.Session.GetString("MailPromotionalApiKey");
            else
                ApiKey = HttpContext.Session.GetString("MailTransactionalApiKey");
            if (commonDetails.IsMasked == 0)
            {
                int cnt = ApiKey.Length <= 5 ? ApiKey.Length - 1 : ApiKey.Length - 5;
                ApiKey = ApiKey.Substring(cnt).PadLeft(ApiKey.Length, '*');
            }

            return Json(new { ApiKey });
        }

        [HttpPost]
        public async Task<JsonResult> GetProviderNameForDomainValidation([FromBody] MailSettings_GetProviderNameForDomainValidation commonDetails)
        {
            List<MailConfiguration> mailConfigurationDetails = null;

            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetProviderNameForDomainValidation();
            }
            return Json(new { mailConfigurationDetails = mailConfigurationDetails });

        }

        [HttpPost]
        public async Task<JsonResult> GetDetailsofVerfiyDomain()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<MLMailAutheintication> DomainDetailsList = null;

            using (var objDL = DLMailAutheintication.GetMailAutheintication(account.AdsId, SQLProvider))
            {
                DomainDetailsList = await objDL.GET(new MLMailAutheintication());
            }

            if (DomainDetailsList == null || DomainDetailsList.Count <= 0)
            {
                MLMailAutheintication objML = new MLMailAutheintication() { Domain = account.DomainName };
                DomainDetailsList.Add(objML);
            }

            return Json(DomainDetailsList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteDomainInfo([FromBody] MailSettings_DeleteDomainInfo commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            bool result = false;
            using (var objDL = DLMailAutheintication.GetMailAutheintication(commonDetails.accountId, SQLProvider))
            {
                result = await objDL.Delete(commonDetails.Id);

            }
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetUnsubscribeUrlDetails([FromBody] MailSettings_GetUnsubscribeUrlDetails commonDetails)
        {
            List<MailConfiguration> mailConfigurationDetails = null;

            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetUnsubscribeUrlDetails();
            }
            return Json(new { mailConfigurationDetails = mailConfigurationDetails });

        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveUnsubscribeUrl([FromBody] MailSettings_SaveUnsubscribeUrl commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            bool Result = false;
            using (var mailConfiguration = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                Result = await mailConfiguration.SaveUnsubscribeUrl(commonDetails.UnsubscribeUrl);
            }

            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetSpamScoreSettingDetails([FromBody] MailSettings_GetSpamScoreSettingDetails commonDetails)
        {
            List<MailSpamScoreVerifySetting> settings = null;
            using (var objDL = DLMailSpamScoreVerifySetting.GetDLMailSpamScoreVerifySetting(commonDetails.AdsId, SQLProvider))
            {
                settings = await objDL.GetList();
            }
            return Json(settings);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveorUpdateSpamScore([FromBody] MailSettings_SaveorUpdateSpamScore commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs    
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AdsId, user.UserId, user.UserName, user.EmailId, "MailSettings", "Mail", "SaveorUpdateSpamScore", Helper.GetIP(), JsonConvert.SerializeObject(new { AdsId = AdsId, ProviderSetting = ProviderSetting }));
            //#endregion
            using (var objDL = DLMailSpamScoreVerifySetting.GetDLMailSpamScoreVerifySetting(commonDetails.AdsId, SQLProvider))
            {
                commonDetails.ProviderSetting.UserInfoUserId = user.UserId;
                if (commonDetails.ProviderSetting.Id > 0)
                {
                    if (!await objDL.Update(commonDetails.ProviderSetting))
                    {
                        commonDetails.ProviderSetting.Id = -1;
                    }
                }
                else
                {
                    commonDetails.ProviderSetting.Id = await objDL.Save(commonDetails.ProviderSetting);
                }

                return Json(commonDetails.ProviderSetting);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetProviderSettingDetails([FromBody] MailSettings_GetSpamScoreSettingDetails commonDetails)
        {
            List<EmailVerifyProviderSetting> settings = null;
            using (var objDL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(commonDetails.AdsId, SQLProvider))
            {
                settings = await objDL.GetList();
                if (settings != null && settings.Count > 0)
                {
                    for (int i = 0; i < settings.Count; i++)
                    {

                        if (settings[i].ApiKey != null)
                        {
                            var apikey = settings[i].ApiKey;
                            var cnt = settings[i].ApiKey.Length;

                            TempData["EmailVerifyApiKey"] = apikey;
                            settings[i].ApiKey = settings[i].ApiKey.Substring(cnt).PadLeft(settings[i].ApiKey.Length, '*');
                            TempData["EmailVerifyMaskedApiKey"] = settings[i].ApiKey;
                        }
                        //settings[i].ApiKey = Regex.Replace(settings[i].ApiKey, @"(?<=[\w]{2})[\w-\._\+%]*", m => new string('*', m.Length));

                        if (settings[i].Password != null)
                        {
                            var Password = settings[i].Password;
                            var cnt = settings[i].Password.Length;

                            TempData["EmailVerifyPassword"] = Password;
                            settings[i].Password = settings[i].Password.Substring(cnt).PadLeft(settings[i].Password.Length, '*');
                            TempData["EmailVerifyMaskedPassword"] = settings[i].Password;
                        }
                        //settings[i].Password = Regex.Replace(settings[i].Password, @"(?<=[\w]{2})[\w-\._\+%]*", m => new string('*', m.Length));
                    }
                }
            }
            return Json(settings);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveorUpdateEmailVerify([FromBody] MailSettings_SaveorUpdateEmailVerify commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var objDL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(commonDetails.AdsId, SQLProvider))
            {
                if (commonDetails.ProviderSetting.ApiKey == Convert.ToString(TempData["EmailVerifyMaskedApiKey"]))
                    commonDetails.ProviderSetting.ApiKey = TempData["EmailVerifyApiKey"].ToString();

                if (commonDetails.ProviderSetting.Password == Convert.ToString(TempData["EmailVerifyMaskedPassword"]))
                    commonDetails.ProviderSetting.Password = TempData["EmailVerifyPassword"].ToString();

                commonDetails.ProviderSetting.UserInfoUserId = user.UserId;
                if (commonDetails.ProviderSetting.Id > 0)
                {
                    if (!await objDL.Update(commonDetails.ProviderSetting))
                    {
                        commonDetails.ProviderSetting.Id = -1;
                    }
                }
                else
                {
                    commonDetails.ProviderSetting.Id = await objDL.Save(commonDetails.ProviderSetting);
                }

                return Json(commonDetails.ProviderSetting);
            }
        }

        [HttpPost]
        public async Task<JsonResult> ProviderValidate([FromBody] MailSettings_ProviderValidate commonDetails)
        {
            var proresult = false; var traresult = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MailConfiguration> mailConfigurationDetails = null;
            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetDetailsByProviderName(commonDetails.ProviderName);
            }


            using (var client = new CheckSpamAssassinDetails(SQLProvider))
            {
                foreach (var mailconfig in mailConfigurationDetails)
                {
                    if (mailconfig.IsPromotionalOrTransactionalType)
                        traresult = client.SendMail(mailconfig, "support@plumb5.com", commonDetails.FromEmailId, "Support", "Email Provider Validate", "Email Provider Validate", commonDetails.accountId);
                    else
                        proresult = client.SendMail(mailconfig, "support@plumb5.com", commonDetails.FromEmailId, "Support", "Email Provider Validate", "Email Provider Validate", commonDetails.accountId);

                }
            }

            return Json(new { Promotional = proresult, Transactional = traresult });
        }

        [HttpPost]
        public JsonResult GetConfiguredDeliveryURL()
        {
            var GeneralConfigurationSetting = new GeneralMailConfigurationSetting();
            return Json(GeneralConfigurationSetting);
        }

        [HttpPost]
        public async Task<JsonResult> CheckMailSettingConfigured([FromBody] MailSettings_CheckMailSettingConfigured commonDetails)
        {
            List<MailConfiguration> mailConfigurationDetails = null;
            bool result = false;

            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailConfigurationDetails = await objDL.GetServiceProviderlDetails();

                if (mailConfigurationDetails != null && mailConfigurationDetails.Count > 0)
                    result = true;
                else
                    result = false;

                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetConfigurationNamesList([FromBody] MailSettings_CheckMailSettingConfigured commonDetails)
        {
            using (var objBL = DLMailConfigurationName.GetDLMailConfigurationName(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.GetConfigurationNamesList());
            }
        }

        [HttpPost]
        public async Task<JsonResult> ArchiveVendorDetails([FromBody] MailSettings_ArchiveVendorDetails commonDetails)
        {
            bool result = false;
            using (var objDL = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                result = await objDL.ArchiveVendorDetails(commonDetails.mailConfigurationNameId);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetConfigurationNames([FromBody] MailSettings_CheckMailSettingConfigured commonDetails)
        {
            using (var objBL = DLMailConfigurationName.GetDLMailConfigurationName(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.GetConfigurationNames());
            }
        }
    }
}
