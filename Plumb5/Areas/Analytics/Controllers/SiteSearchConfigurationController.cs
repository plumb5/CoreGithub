using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using System.Text.RegularExpressions;
using System.Reflection.PortableExecutable;
using NPOI.SS.Formula.Functions;
using System.Web;
using IP5GenralDL;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class SiteSearchConfigurationController : BaseController
    {
        public SiteSearchConfigurationController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("SiteSearchConfiguration");
        }

        [HttpPost]
        public async Task<JsonResult> SendSiteSearchRequestMail([FromBody] SiteSearchConfiguration_SendSiteSearchRequestMailDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool SentStatus = false;
            MailConfiguration mailconfiguration = new MailConfiguration();

            using (var objmailconfiguration = DLMailConfiguration.GetDLMailConfiguration(details.accountId, SQLProvider))
            {
                mailconfiguration = await objmailconfiguration.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            string FromEmailId = "";
            string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();

            using (var objmailconfigforsending = DLMailConfigForSending.GetDLMailConfigForSending(details.accountId, SQLProvider))
            {
                MailConfigForSending mailConfig = await objmailconfigforsending.GetActiveFromEmailId();
                if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                    FromEmailId = mailConfig.FromEmailId;
            }

            if (mailconfiguration != null && mailconfiguration.Id > 0 && !string.IsNullOrWhiteSpace(FromEmailId))
            {
                string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\SiteSearchRequestMail.html";
                string MailBody = "";
                if (System.IO.File.Exists(filePath))
                {
                    using (StreamReader rd = new StreamReader(filePath))
                    {
                        MailBody = rd.ReadToEnd();
                        rd.Close();
                    }

                    MailBody = MailBody.Replace("<!--AccountName-->", details.Plumb5AccountName);
                    MailBody = MailBody.Replace("<!--AccountDomain-->", details.Plumb5AccountDomain);
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
                        Subject = "Enable Site Search for  " + details.Plumb5AccountDomain,
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
                        EmailId = AllConfigURLDetails.KeyValueForConfig["SITESEARCHTOEMAIL"].ToString(),
                        P5MailUniqueID = Guid.NewGuid().ToString()
                    };

                    MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                    {
                        ConfigurationId = 0,
                        GroupId = 0
                    };

                    IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(details.accountId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "Analytics");
                    SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);
                    if (SentStatus)
                    {
                        using (var objsave = DLSiteSerachConfiguration.GetDLSiteSerachConfiguration(details.accountId, SQLProvider))
                        {
                            await objsave.Save(user, details.Plumb5AccountName, details.Plumb5AccountDomain, details.SiteSearchUrl);
                        }
                    }

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

                        using (var objDL = DLMailSent.GetDLMailSent(details.accountId, SQLProvider))
                        {
                            await objDL.Send(responseMailSent);
                        }
                    }
                }
            }
            return Json(SentStatus);
        }
    }
}
