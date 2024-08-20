using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MyProfile.Dto;
using Plumb5.Controllers;
using Plumb5.Models;
using Plumb5GenralFunction;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class TrackingScriptController : BaseController
    {
        public TrackingScriptController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /MyProfile/TrackingScript/

        public IActionResult Index()
        {
            return View("TrackingScript");
        }
        [HttpPost]
        public async Task<JsonResult> GetAccountInfo([FromBody] TrackingScript_GetAccountInfoDto TrackingScriptDto)
        {
            MyAccountsDetails myAccount = new MyAccountsDetails(SQLProvider);
            await myAccount.GetInformationForHome(TrackingScriptDto.UserId);
            return Json(new { myAccount } );
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> SendTrackingScript([FromBody] TrackingScript_SendTrackingScriptDto TrackingScriptDto)
        {
            bool Status = false;
            try
            {
                MailConfiguration transactionalMailConfiguration = null;
                using (var objDL =   DLMailConfiguration.GetDLMailConfiguration(TrackingScriptDto.AdsId, SQLProvider))
                {
                    transactionalMailConfiguration = await objDL.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                }

                if (transactionalMailConfiguration != null)
                {
                    string FromEmailId = "";
                    string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
                    using (var objDL =   DLMailConfigForSending.GetDLMailConfigForSending(TrackingScriptDto.AdsId, SQLProvider))
                    {
                        MailConfigForSending mailConfig =await objDL.GetActiveFromEmailId();
                        if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                            FromEmailId = mailConfig.FromEmailId;
                    }

                    if (!string.IsNullOrWhiteSpace(FromEmailId))
                    {
                        Contact contact = new Contact() { EmailId = TrackingScriptDto.emailId };
                        using (var objDLContact =   DLContact.GetContactDetails(TrackingScriptDto.AdsId, SQLProvider))
                        {
                            contact =await objDLContact.GetDetails(contact);
                            if (contact == null)
                                contact = new Contact() { EmailId = TrackingScriptDto.emailId };
                        }

                        MLMailSent mailsent = new MLMailSent()
                        {
                            EmailId = contact.EmailId,
                            MailTemplateId = 0,
                            MailCampaignId = 0,
                            MailSendingSettingId = 0,
                            GroupId = 0,
                            Id = 0,
                            ContactId = contact.ContactId,
                            P5MailUniqueID = Guid.NewGuid().ToString(),
                            WorkFlowDataId = 0,
                            WorkFlowId = 0,
                            TriggerMailSmsId = 0
                        };

                        MailSetting mailSetting = new MailSetting()
                        {
                            Forward = false,
                            FromEmailId = FromEmailId,
                            FromName = FromName,
                            MailTemplateId = 0,
                            ReplyTo = FromEmailId,
                            Subject = TrackingScriptDto.subject,
                            Subscribe = false,
                            IsSchedule = false,
                            IsTransaction = true,
                            MessageBodyText = TrackingScriptDto.MailBody
                        };

                        MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                        {
                            ConfigurationId = 0,
                            GroupId = 0
                        };

                        IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(TrackingScriptDto.AdsId, mailSetting, mailSentSavingDetials, transactionalMailConfiguration, "MailTrack", "TrackingScriptMail");
                        Status = MailGeneralBaseFactory.SendSingleMail(mailsent);

                        if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0 && Status)
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
                                MailConfigurationNameId = transactionalMailConfiguration.MailConfigurationNameId
                            };

                            using (var objDL =   DLMailSent.GetDLMailSent(TrackingScriptDto.AdsId, SQLProvider))
                            {
                                objDL.Send(responseMailSent);
                            }
                        }
                    }
                }

                return Json(Status );
            }
            catch
            {
                return Json(false );
            }
        }
    }
}
