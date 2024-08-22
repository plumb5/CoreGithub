using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class CallSettingsController : BaseController
    {
        public CallSettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/CallSettings/

        public IActionResult Index()
        {
            return View("CallSettings");
        }

        [HttpPost]
        public async Task<JsonResult> GetClickToCallSettingsDetails([FromBody] CallSettingsDto_GetClickToCallSettingsDetails commonDetails)
        {
            MLCallApiConfiguration? CallApiConfigurationList = new MLCallApiConfiguration();
            using (var objDL = DLCallApiConfiguration.GetDLCallApiConfiguration(commonDetails.AdsId, SQLProvider))
            {
                CallApiConfigurationList = await objDL.GetCallConfigurationDetails();
            }
            return Json(CallApiConfigurationList);
        }

        [HttpPost]
        public async Task<JsonResult> GetPrimaryPhone([FromBody] CallSettingsDto_GetPrimaryPhone commonDetails)
        {
            UserInfo? user = new UserInfo();
            using (var objuser = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                user = await objuser.GetDetail(commonDetails.userId);
            }
            return Json(user);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdatePrimaryPhone([FromBody] CallSettingsDto_UpdatePrimaryPhone commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            UserInfo? userInfo = new UserInfo();
            using (var objuser = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                userInfo = await objuser.GetDetail(user.UserId);
            }
            userInfo.Password = null;
            userInfo.SetPrimaryPhoneNumber = commonDetails.setPrimaryPhone;

            bool Status = false;
            using (var objuser = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                Status = await objuser.UpdateDetails(userInfo);
            }

            return Json(Status);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendClickToCallRequest([FromBody] CallSettingsDto_SendClickToCallRequest commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "CallSettings", "SendClickToCallRequest", Helper.GetIP(), JsonConvert.SerializeObject(new { Plumb5AccountName = Plumb5AccountName, Plumb5AccountDomain = Plumb5AccountDomain }));
            //#endregion

            bool SentStatus = false;
            MailConfiguration mailconfiguration = new MailConfiguration();
            using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(commonDetails.accountId, SQLProvider))
            {
                mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            string FromEmailId = "";
            string? FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(commonDetails.accountId, SQLProvider))
            {
                MailConfigForSending? mailConfig = await objDL.GetActiveFromEmailId();
                if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                    FromEmailId = mailConfig.FromEmailId;
            }

            if (mailconfiguration != null && mailconfiguration.Id > 0 && !string.IsNullOrWhiteSpace(FromEmailId))
            {
                string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\click-to-call-activate-template.html";
                string MailBody = "";
                if (System.IO.File.Exists(filePath))
                {
                    using (StreamReader rd = new StreamReader(filePath))
                    {
                        MailBody = rd.ReadToEnd();
                        rd.Close();
                    }

                    MailBody = MailBody.Replace("<!--AccountName-->", commonDetails.Plumb5AccountName);
                    MailBody = MailBody.Replace("<!--AccountDomain-->", commonDetails.Plumb5AccountDomain);
                    MailBody = MailBody.Replace("<!--UserName-->", user.UserName);
                    MailBody = MailBody.Replace("<!--UserEmailId-->", user.EmailId);
                    MailBody = MailBody.Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                    MailSetting mailSetting = new MailSetting()
                    {
                        Forward = false,
                        FromEmailId = FromEmailId,
                        FromName = FromName,
                        MailTemplateId = 0,
                        ReplyTo = FromEmailId,
                        Subject = "Activate Click to Call Plan",
                        Subscribe = true,
                        MessageBodyText = MailBody,
                        IsTransaction = false
                    };

                    MLMailSent mailSent = new MLMailSent()
                    {
                        MailCampaignId = 0,
                        MailSendingSettingId = 0,
                        GroupId = 0,
                        ContactId = 0,
                        EmailId = "dassupport@decisive.in",
                        P5MailUniqueID = Guid.NewGuid().ToString()
                    };

                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                    {
                        ConfigurationId = 0,
                        GroupId = 0
                    };

                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(commonDetails.accountId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "LMS");
                    SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                    if (SentStatus)
                    {
                        //LogMessage = "Activate click to call plan mail sent successfully";

                        MailSent getmailSent = new MailSent()
                        {
                            FromEmailId = mailSetting.FromEmailId,
                            FromName = mailSetting.FromName,
                            MailTemplateId = 0,
                            Subject = mailSetting.Subject,
                            MailCampaignId = 0,
                            MailSendingSettingId = 0,
                            GroupId = 0,
                            ContactId = 0,
                            EmailId = MailGeneralBaseFactory.VendorResponses[0].EmailId,
                            P5MailUniqueID = MailGeneralBaseFactory.VendorResponses[0].P5MailUniqueID,
                            CampaignJobName = MailGeneralBaseFactory.VendorResponses[0].CampaignJobName,
                            ErrorMessage = "",
                            ProductIds = MailGeneralBaseFactory.VendorResponses[0].ProductIds,
                            ResponseId = MailGeneralBaseFactory.VendorResponses[0].ResponseId,
                            SendStatus = (byte)MailGeneralBaseFactory.VendorResponses[0].SendStatus,
                            WorkFlowDataId = MailGeneralBaseFactory.VendorResponses[0].WorkFlowDataId,
                            WorkFlowId = MailGeneralBaseFactory.VendorResponses[0].WorkFlowId,
                            SentDate = DateTime.Now,
                            ReplayToEmailId = mailSetting.ReplyTo,
                            MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                        };

                        using (var objDLMailSent = DLMailSent.GetDLMailSent(commonDetails.accountId, SQLProvider))
                        {
                            await objDLMailSent.Send(getmailSent);
                        }
                    }
                    else
                    {
                        MailSent getmailSent = new MailSent()
                        {
                            FromEmailId = mailSetting.FromEmailId,
                            FromName = mailSetting.FromName,
                            MailTemplateId = 0,
                            Subject = mailSetting.Subject,
                            MailCampaignId = 0,
                            MailSendingSettingId = 0,
                            GroupId = 0,
                            ContactId = 0,
                            EmailId = MailGeneralBaseFactory.VendorResponses[0].EmailId,
                            P5MailUniqueID = MailGeneralBaseFactory.VendorResponses[0].P5MailUniqueID,
                            CampaignJobName = MailGeneralBaseFactory.VendorResponses[0].CampaignJobName,
                            ErrorMessage = MailGeneralBaseFactory.VendorResponses[0].ErrorMessage,
                            ProductIds = MailGeneralBaseFactory.VendorResponses[0].ProductIds,
                            ResponseId = MailGeneralBaseFactory.VendorResponses[0].ResponseId,
                            SendStatus = 0,
                            WorkFlowDataId = 0,
                            WorkFlowId = 0,
                            SentDate = DateTime.Now,
                            ReplayToEmailId = mailSetting.ReplyTo,
                            MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                        };

                        using (var objDLMailSent = DLMailSent.GetDLMailSent(commonDetails.accountId, SQLProvider))
                        {
                            await objDLMailSent.Send(getmailSent);
                        }
                    }
                }
            }
            return Json(SentStatus);
        }
    }
}
